private var rotSmooth:float = 10;
private var rotSpeed:float = 0.3;

private var rotLandSmooth:float = 20;
private var rotLandSpeed:float = 0.5;

private var playerVelocity = Vector3.zero;

private var rayHit:RaycastHit;
private var rayHit2:RaycastHit;
private var rayHit3:RaycastHit;

public var hitWorldPoint:Vector3;

function JumpRotation(){

	var control: playerControl = GetComponent(playerControl); 

	//get the local position of the ray to ground point (more relyable then hit.distance)
	var globalToLocal = transform.InverseTransformPoint(control.rayHit.point);
	var globalToLocal2 = transform.InverseTransformPoint(control.rayHit2.point);
	var globalToLocal3 = transform.InverseTransformPoint(control.rayHit3.point);
	//check if the ray is within range to the ground
	if(globalToLocal.y > -1.15 || globalToLocal2.y > -1.15 || globalToLocal3.y > -1.15){ //if feels odd change back to 1.3
		control.grounded = true;
	}
	if(globalToLocal.y <= -1.15 && globalToLocal2.y <= -1.15 && globalToLocal3.y <= -1.15){
		control.grounded = false;
	}
	var axis = Vector3.Cross(-transform.up,-control.rayHit.normal);
	var angle = Mathf.Atan2(Vector3.Magnitude(axis), Vector3.Dot(-transform.up,-control.rayHit.normal));

	if(control.downHill == false){
		var jumpRotation = Quaternion.Euler(0, 0, 0);
		var jumpRotationLand = Quaternion.FromToRotation(transform.up, control.rayHit.normal);
		if(transform.eulerAngles.z < 20 && transform.eulerAngles.z >= -10 || transform.eulerAngles.z <= 360 && transform.eulerAngles.z >= 270){

			if(globalToLocal.y <= -3 && globalToLocal2.y <= -3 && globalToLocal3.y <= -3){
				//once in the air rotate upright
				transform.localRotation = Quaternion.Lerp(transform.localRotation, jumpRotation, rotSpeed * Time.deltaTime * rotSmooth);
			}
			if(globalToLocal.y > -3 && globalToLocal.y < -1.15 || globalToLocal2.y > -3 && globalToLocal2.y < -1.15 || globalToLocal3.y > -3 && globalToLocal3.y < -1.15){
				//smooth the player landing fixing angular snap
				transform.localRotation = Quaternion.Slerp(transform.localRotation, jumpRotationLand, rotLandSpeed * Time.deltaTime * rotLandSmooth);
			}
		}else{
			//if(globalToLocal.y <= -3 && globalToLocal2.y <= -3 && globalToLocal3.y <= -3){
				//once in the air rotate around
				transform.RotateAround(axis,angle);
			//}
			/*if(globalToLocal.y > 1 && globalToLocal2.y > 1 && globalToLocal3.y > 1){
				//once in the air rotate upright
				transform.localRotation = Quaternion.Lerp(transform.localRotation, jumpRotation, rotSpeed * Time.deltaTime * rotSmooth);
			}*/
		}
	}else{
		//once in the air rotate upright
		transform.RotateAround(axis,angle);
	}
}

function FloorDetection(){
	var control: playerControl = GetComponent(playerControl); 

	//Detect the conture of the mesh beneath the character by recieveing the Vector3 rotation of the ray point in relation to character and converting it to a tangent then snapping the rotation.
	var axis = Vector3.Cross(-transform.up,-control.rayHit.normal);

	if(axis != Vector3.zero)
	{
		var angle = Mathf.Atan2(Vector3.Magnitude(axis), Vector3.Dot(-transform.up,-control.rayHit.normal));
		transform.RotateAround(axis,angle);
	}
	//Place Snap the characters position to the mesh regardless of angle using an offset smoothly when on the ground. (otherwise you can float, vertical velocity messes with horizontal velocity speed)
	hitWorldPoint = control.rayHit.point + control.rayHit.normal * offsetAmount;
	if (hitWorldPoint == Vector3.zero){
	}else{
    	var smoothDamp = Vector3.SmoothDamp(transform.localPosition, hitWorldPoint, playerVelocity, posSpeed * Time.deltaTime / posSmoothDamp);
    	transform.localPosition = smoothDamp;
	}
}
