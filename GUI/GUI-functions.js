#pragma strict

private var pausemenu : GameObject;

public function startGame() {
	print("play game screen option clicked");
	Application.LoadLevel("_makeYOURlevel_Lite_exemple");
}

public function credits() {
	print("credits screen option clicked");
	Application.LoadLevel("credits");
}

public function quitGame() {
	print("exit screen option clicked");
	Application.Quit();
}

public function mainMenu() {
	Application.LoadLevel("Main-Menu");
}

public function restartGame() {
	unpause();
	Application.LoadLevel(Application.loadedLevel);
}

public function unpause() {
	var paused = GameObject.FindGameObjectWithTag("GameController").GetComponent(PauseGUI);
	paused.isPaused = false;
	Time.timeScale = 1.0;
	pausemenu = GameObject.FindGameObjectWithTag("pause");
	pausemenu.SetActive(false);
}