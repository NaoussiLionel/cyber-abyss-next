import { MAX_PLAYERS } from '@/lib/constants';

type PeerConnection = any;
type PeerInstance = any;

export interface NetworkMessage {
  type: string;
  [key: string]: any;
}

const PLAYER_COLORS = ['#ff4444', '#44ff44', '#4488ff', '#ffcc00'];

export class NetworkSystem {
  peer: PeerInstance | null = null;
  connections: PeerConnection[] = [];
  isHost = false;
  roomId = '';
  isReady = false;
  connectedPlayers: { id: number; name: string; ready: boolean; team: 'A' | 'B' }[] = [];
  playerColors = [...PLAYER_COLORS];
  playerNames: string[] = [];
  mySlotIndex = -1;

  private PeerClass: any = null;
  private onStateChange: ((players: typeof this.connectedPlayers) => void) | null = null;

  async init(): Promise<void> {
    const mod = await import('peerjs');
    this.PeerClass = mod.default;
  }

  generateRoomId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'CYB-';
    for (let i = 0; i < 4; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  }

  async createRoom(
    mode: string,
    playerName: string,
    stateChangeCallback?: (players: typeof this.connectedPlayers) => void
  ): Promise<string> {
    if (!this.PeerClass) await this.init();

    this.roomId = this.generateRoomId();
    this.isHost = true;
    this.mySlotIndex = 0;
    this.onStateChange = stateChangeCallback ?? null;

    this.connectedPlayers = [
      { id: 0, name: playerName, ready: false, team: 'A' },
    ];
    this.playerNames = [playerName];

    return new Promise((resolve, reject) => {
      this.peer = new this.PeerClass(this.roomId);

      this.peer.on('open', (id: string) => {
        this.roomId = id;
        resolve(id);
      });

      this.peer.on('connection', (conn: PeerConnection) => {
        if (this.connections.length >= MAX_PLAYERS - 1) {
          conn.close();
          return;
        }
        const slotIndex = this.connections.length + 1;
        this.setupConnection(conn, slotIndex);
      });

      this.peer.on('error', (err: Error) => {
        console.error('PeerJS host error:', err);
        reject(err);
      });
    });
  }

  async joinRoom(
    roomId: string,
    playerName: string,
    stateChangeCallback?: (players: typeof this.connectedPlayers) => void
  ): Promise<void> {
    if (!this.PeerClass) await this.init();

    this.isHost = false;
    this.onStateChange = stateChangeCallback ?? null;

    const peerId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    return new Promise((resolve, reject) => {
      this.peer = new this.PeerClass(peerId);

      this.peer.on('open', () => {
        const conn = this.peer.connect(roomId, { reliable: true });
        conn.on('open', () => {
          this.roomId = roomId;
          this.setupConnection(conn, -1);

          const handshake: NetworkMessage = {
            type: 'handshake',
            playerName,
            slotIndex: -1,
          };
          conn.send(handshake);
          resolve();
        });

        conn.on('error', (err: Error) => {
          console.error('Connection error:', err);
          reject(err);
        });
      });

      this.peer.on('error', (err: Error) => {
        console.error('PeerJS guest error:', err);
        reject(err);
      });
    });
  }

  setupConnection(conn: PeerConnection, slotIndex: number): void {
    this.connections.push(conn);

    conn.on('data', (data: NetworkMessage) => {
      this.handleMessage(data, conn, slotIndex);
    });

    conn.on('close', () => {
      const idx = this.connections.indexOf(conn);
      if (idx !== -1) {
        this.connections.splice(idx, 1);
        this.connectedPlayers = this.connectedPlayers.filter((_, i) => i !== idx + (this.isHost ? 0 : 1));
        this.updateLobbyPlayers();
      }
    });
  }

  handleMessage(data: NetworkMessage, conn: PeerConnection, slotIndex: number): void {
    switch (data.type) {
      case 'handshake': {
        if (this.isHost) {
          const assignedSlot = this.connectedPlayers.length;
          data.slotIndex = assignedSlot;

          this.connectedPlayers.push({
            id: assignedSlot,
            name: data.playerName ?? `Player ${assignedSlot + 1}`,
            ready: false,
            team: 'A',
          });
          this.playerNames.push(data.playerName ?? `Player ${assignedSlot + 1}`);

          const response: NetworkMessage = {
            type: 'handshake',
            slotIndex: assignedSlot,
            playerName: this.playerNames[0],
            players: this.connectedPlayers,
          };
          conn.send(response);

          this.send({
            type: 'playerList',
            players: this.connectedPlayers,
          });

          this.updateLobbyPlayers();
        } else {
          if (data.players) {
            this.connectedPlayers = data.players;
            this.mySlotIndex = data.slotIndex ?? -1;
          } else if (data.slotIndex !== undefined) {
            this.mySlotIndex = data.slotIndex;
          }
          this.updateLobbyPlayers();
        }
        break;
      }

      case 'ready': {
        if (this.isHost) {
          const player = this.connectedPlayers.find((p) => p.id === data.slotIndex);
          if (player) {
            player.ready = data.ready;
          }
          this.send({
            type: 'playerList',
            players: this.connectedPlayers,
          });
          this.updateLobbyPlayers();
        }
        break;
      }

      case 'start': {
        if (!this.isHost) {
          this.onStateChange?.(this.connectedPlayers);
        }
        break;
      }

      case 'input': {
        if (this.isHost) {
          this.onStateChange?.(this.connectedPlayers);
        }
        break;
      }

      case 'state': {
        if (!this.isHost) {
          this.onStateChange?.(this.connectedPlayers);
        }
        break;
      }

      case 'shoot': {
        if (this.isHost) {
          this.sendExcept(conn, data);
        }
        break;
      }

      case 'teamChange': {
        if (this.isHost) {
          const player = this.connectedPlayers.find((p) => p.id === data.slotIndex);
          if (player) {
            player.team = data.team;
          }
          this.send({
            type: 'playerList',
            players: this.connectedPlayers,
          });
          this.updateLobbyPlayers();
        }
        break;
      }

      case 'mapChange': {
        if (this.isHost) {
          this.sendExcept(conn, data);
        }
        break;
      }

      case 'playerList': {
        if (!this.isHost && data.players) {
          this.connectedPlayers = data.players;
          this.updateLobbyPlayers();
        }
        break;
      }
    }
  }

  send(data: NetworkMessage): void {
    if (this.isHost) {
      for (const conn of this.connections) {
        try {
          conn.send(data);
        } catch {
          // connection may be closed
        }
      }
    } else if (this.connections.length > 0) {
      try {
        this.connections[0].send(data);
      } catch {
        // connection may be closed
      }
    }
  }

  private sendExcept(exclude: PeerConnection, data: NetworkMessage): void {
    for (const conn of this.connections) {
      if (conn !== exclude) {
        try {
          conn.send(data);
        } catch {
          // connection may be closed
        }
      }
    }
  }

  disconnect(): void {
    for (const conn of this.connections) {
      try {
        conn.close();
      } catch {
        // ignore
      }
    }
    this.connections = [];

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {
        // ignore
      }
      this.peer = null;
    }

    this.isHost = false;
    this.roomId = '';
    this.isReady = false;
    this.connectedPlayers = [];
    this.playerNames = [];
    this.mySlotIndex = -1;
  }

  updateLobbyPlayers(): typeof this.connectedPlayers {
    return this.connectedPlayers;
  }
}
