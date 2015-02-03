#pragma strict

@script RequireComponent(Canvas)

public var isPaused : boolean = false;
private var pausemenu : GameObject;

function Start() {
	pausemenu = GameObject.FindGameObjectWithTag("pause");
	pausemenu.SetActive(false);
	Time.timeScale = 1.0;
	isPaused = false;
}

function Update() {
	if(Input.GetKeyDown(KeyCode.P)) {
		pauseGame();
	}
}

function restartGame() {
	Time.timeScale = 1.0;
	isPaused = false;
	Application.LoadLevel(Application.loadedLevel);
}

public function pauseGame() {

	if(isPaused == false) {
		Time.timeScale = 0.0;
		isPaused = true;
		pausemenu.SetActive(true);
		print('paused');
	} else {
		Time.timeScale = 1.0;
		isPaused = false;
		pausemenu.SetActive(false);
		print('not paused');
	}
}

public function unpause() {
	Time.timeScale = 1.0;
	isPaused = false;
	pausemenu.SetActive(false);
	print('not paused');
}