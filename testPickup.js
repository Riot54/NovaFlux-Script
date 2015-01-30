#pragma strict

function Start () {
	particleSystem.emissionRate = 0;
}

function Update () {

}

function OnTriggerEnter(other:Collider){
	if(other.tag == 'Player'){
		particleSystem.Emit(10);
		yield WaitForSeconds(2);
		Destroy(gameObject);
	}
}