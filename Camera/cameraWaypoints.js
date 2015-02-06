#pragma strict
private var player:GameObject;

public var waypoint:Transform[];

private var currentWaypoint:float = 0;

public var moveSpeed:float = 18;
public var moveSmooth:float = 10;
private var staticCam:boolean = false;

public var startMove:boolean = false;

private var offsetY:float = 3;

private var theEnd:boolean = false;

private var cameraPosition:int = 1;

private var pPos1:GameObject;
private var pPos2:GameObject;
private var pPos3:GameObject;

private var pPosHolder:GameObject;

private var zoomSpeed:float = 1;
private var zoomSmooth:float = 10;

private var modZoom:float = 60;
private var currentZoom:float = 60;


private var cameraMain:Camera;	

function Start () {
	player = GameObject.FindWithTag("Player");
	pPosHolder = GameObject.Find("pPosHolder");
	pPos1 = GameObject.Find("pPos1");
	pPos2 = GameObject.Find("pPos2");
	pPos3 = GameObject.Find("pPos3");
	cameraMain = GameObject.FindWithTag("MainCamera").camera;
}

function Update() {
	for (var i = 1; i < waypoint.Length; i++) {
		Debug.DrawLine(waypoint[i-1].transform.position, waypoint[i].transform.position);
	}
	var camModScript: cameraMods = waypoint[currentWaypoint].GetComponent(cameraMods); 
	cameraPosition = camModScript.camPosition;
	moveSpeed = camModScript.moveSpeed;
	moveSmooth = camModScript.smooth;
	staticCam = camModScript.staticCam;
	modZoom = camModScript.zoom;

	if(cameraPosition == 1){
		pPosHolder.transform.parent = pPos1.transform;
		pPosHolder.transform.localPosition = Vector3(0,0,0);
	}

	if(cameraPosition == 2){
		pPosHolder.transform.parent = pPos2.transform;
		pPosHolder.transform.localPosition = Vector3(0,0,0);
	}

	if(cameraPosition == 3){
		pPosHolder.transform.parent = pPos3.transform;
		pPosHolder.transform.localPosition = Vector3(0,0,0);
	}

	//cameraMain.fieldOfView = Mathf.Lerp(currentZoom, modZoom, Time.deltaTime * zoomSmooth);
	Debug.Log(currentZoom);
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
		var dirNorm : Vector3 = (target - transform.position).normalized * moveSpeed;
		if(!staticCam){
			if (wpDistance <= 1){
				if(!theEnd){
					currentZoom = modZoom;
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
