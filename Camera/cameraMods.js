#pragma strict

public var moveSpeed:float = 18;

public var smooth:float = 10;

public var zoomAmount:float = 0;

public var staticCam:boolean = false;
public var pauseCam:boolean = false;

function Start () {

}

function Update () {
}

function OnDrawGizmos () {
		// Draw a yellow sphere at the transform's position
		Gizmos.color = Color.green;
		Gizmos.DrawWireSphere (transform.position, 1);
}