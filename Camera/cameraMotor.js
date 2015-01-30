#pragma strict
private var player:GameObject;

private var audioStop:boolean = false;

private var currentWaypoint:float = 0;

private var moveSpeed:float = 25;
private var moveSmooth:float = 10;
private var staticCam:boolean = false;

public var startMove:boolean = false;

private var cameraPos:GameObject;
private var offsetY:float = 3;

function Start () {
	player = GameObject.FindWithTag("Player");
	cameraPos = GameObject.Find("CameraFollow");
}

function FixedUpdate(){

	var control: playerControl = player.GetComponent(playerControl);

	var target : Vector3 = cameraPos.transform.position;
	var targetNormal = target.normalized;

	if(control.playMusic && !audioStop){
		PlayMusic();
		startMove = true;
	}
	
	if(!staticCam){
		transform.position.x = Mathf.MoveTowards(transform.position.x, target.x + targetNormal.x, moveSpeed * Time.deltaTime);
		transform.position.y = Mathf.Lerp(transform.position.y, target.y, moveSpeed * Time.deltaTime);//Mathf.Lerp(this.transform.position.y, player.transform.position.y, moveSpeed * Time.deltaTime);
	}
	if(staticCam){
		StaticCam();
	}
}

function StaticCam(){
		var target : Vector3 = cameraPos.transform.position;
		var targetNormal = target.normalized;
		var cpDistance = Vector3.Distance(target, transform.position);
		if (cpDistance <= 1){

		}else{
			transform.position.x = Mathf.MoveTowards(transform.position.x, target.x + targetNormal.x, moveSpeed * Time.deltaTime);
			transform.position.y = transform.position.y;
		}
}

function PauseCam(){
}

function PlayMusic(){
	audio.Play();
	audioStop = true;
}