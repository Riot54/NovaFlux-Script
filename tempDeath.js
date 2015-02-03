#pragma strict

function OnTriggerEnter(other : Collider) {
	var checkPointTracker = GameObject.Find("Player").GetComponent(checkPointTracker);
	
	if(other.collider.name == 'Player'){
		
		Debug.Log("Dead");
		this.gameObject.transform.position = checkPointTracker.LastCheckPoint;
		Debug.Log(checkPointTracker.LastCheckPoint);
		Debug.Log(this.gameObject.transform.position);
	}

}