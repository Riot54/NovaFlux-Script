#pragma strict

function OnTriggerEnter(other : Collider) {

	var checkPointTracker = GameObject.Find("Player").GetComponent(checkPointTracker);
	
	Debug.Log("Checkpoint");
	
	if(other.collider.name == 'Player'){
		checkPointTracker.LastCheckPoint = gameObject.transform.position;
		Debug.Log(checkPointTracker.LastCheckPoint);
		
		
	}
	
}
