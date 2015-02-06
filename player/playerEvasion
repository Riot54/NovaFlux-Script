#pragma strict
public var top:boolean = true;

private var player:GameObject;
private var pushDown:boolean = false;
private var pushUp:boolean = false;

public var evSpeedUp:float = 20;
public var evSpeedDown:float = 20;

function Start () {
	player = GameObject.FindWithTag("Player");
}

function FixedUpdate () {
	if(pushDown){
		//player.rigidbody.velocity = (-transform.up * evSpeedDown);
		Debug.Log("down");
		player.rigidbody.velocity = (-transform.up * evSpeedDown);
		pushDown = false;
	}
	if(pushUp){
		//player.rigidbody.velocity = (transform.up * evSpeedUp);
		Debug.Log("up");

		player.rigidbody.velocity = (transform.up * evSpeedUp);
		pushUp = false;
	}
	if(pushUp && pushDown){
		//player.rigidbody.velocity = Vector3(0,0,0);
	}
}

function OnTriggerEnter(other : Collider){
	if(other.tag == "Ground"){
		if(top){
			pushDown = true;
		}else{
			pushUp = true;
		}
	}
}
