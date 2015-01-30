#pragma strict
private var player:GameObject;

public var waypoint:Transform[];

private var currentWaypoint:float = 0;

private var moveSpeed:float = 18;
private var moveSmooth:float = 10;
private var staticCam:boolean = false;

public var startMove:boolean = false;

private var offsetY:float = 3;

private var theEnd:boolean = false;

function Start () {
	player = GameObject.FindWithTag("Player");
}

function Update() {
	for (var i = 1; i < waypoint.Length; i++) {
		Debug.DrawLine(waypoint[i-1].transform.position, waypoint[i].transform.position);
	}
	var camModScript: cameraMods = waypoint[currentWaypoint].GetComponent(cameraMods); 
	moveSpeed = camModScript.moveSpeed;
	moveSmooth = camModScript.smooth;
	staticCam = camModScript.staticCam;
}

function FixedUpdate(){
	var control: playerControl = player.GetComponent(playerControl);

	if(control.playMusic){
		startMove = true;
	}

	if(startMove){
		var target : Vector3 = waypoint[currentWaypoint].position;
		var targetNormal = target.normalized;
		//var wpDistance = Mathf.Abs((target - transform.position).x);
		var wpDistance = Vector3.Distance(target, transform.position);

		var dir : Vector3 = (target - transform.position);
		var dirNorm : Vector3 = (target - transform.position).normalized * 20;
		if(!staticCam){
			if (wpDistance <= 1){
				if(!theEnd){
					currentWaypoint += 1;
				}
			}else{
				//transform.position = Vector3.MoveTowards(transform.position, target, moveSpeed * Time.deltaTime);
				//transform.rotation = Quaternion.Lerp (transform.rotation, waypoint[currentWaypoint].transform.rotation, 3 * Time.deltaTime);
				rigidbody.velocity = dirNorm;
			}
		}
		if(currentWaypoint >= waypoint.Length - 1){
			rigidbody.velocity = dir;
			theEnd = true;
		}else{
		}
	}
}

function OnDrawGizmos () {
	for (var i = 1; i < waypoint.Length; i++) {
		Gizmos.color = Color.red;
		Gizmos.DrawLine (waypoint[i-1].transform.position, waypoint[i].transform.position);
		Gizmos.DrawWireSphere (transform.position, 1);
	}

}
