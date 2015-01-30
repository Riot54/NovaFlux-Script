#pragma strict
private var camFollow:GameObject;

function Start () {
	camFollow = GameObject.Find("CameraFollow");
}

function Update () {

}

function FixedUpdate(){
	rigidbody.velocity = transform.right * camFollow.rigidbody.velocity.x;
}