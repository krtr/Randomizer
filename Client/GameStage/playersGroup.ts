﻿class PlayersGroup {

	List: Player[] = [];
	CurrPlayer: CurrentPlayer;
	private PixiStage: PIXI.DisplayObjectContainer;
	private ground: Ground
	constructor(stage: PIXI.DisplayObjectContainer, ground: Ground) {
		this.PixiStage = stage;
		this.ground = ground;
	}

	Add(data: PlayerFullData) {
		var newPlr = new MuddyHag(data, this.PixiStage, this.ground);
		this.List.push(newPlr);
	}

	Get(ID: string): Player {
		for (var i = 0; i < this.List.length; i++) {
			if (ID == this.List[i].ID) {
				return this.List[i];
			}
		}
		return null;
	}

	Remove(ID: string) {
		for (var i = 0; i < this.List.length; i++) {
			if (this.List[i].ID === ID) {
				this.PixiStage.removeChild(this.List[i]);
				this.List[i].Dispose();
				this.List.splice(i, 1);
			}
		}
	}

	Update(FPS) {
		for (var i = 0; i < this.List.length; i++) {
			this.List[i].Update(FPS);
		}
	}

	ReqForCurrentPlayerData(socket: SocketIOClient.Socket, onDone: () => void) {
		socket.on("FirstPlayer", (data: ServerResponse) => {
			this.CurrPlayer = new CurrentPlayer(new MuddyHag(data.Data[0], this.PixiStage, this.ground), socket, this.ground);
			this.List.push(this.CurrPlayer.player);
			this.PixiStage.addChild(this.CurrPlayer.player);
			onDone();
		});
	}

}
