#pragma strict

function Start () {

}

function Update () {

}

function OnTriggerEnter(other:Collider){
	if(other.tag == "Attack"){
		Destroy(gameObject);
	}
}