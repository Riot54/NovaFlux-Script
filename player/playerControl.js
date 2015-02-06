#pragma strict
//-----------------------
//Character Settings Dynamic Variables
//-----------------------

public var maxJumpSpeed:float = 20;
public var jumpSpeed:float = 100;
public var maxJumpHeight:float = 1;

public var maxRunSpeed:float = 15;


public var gravity:float = 65;

public var jumpAttackHeight:float = 0.8;
private var jumpAttackDistance:float = 0.5;
public var runAttackHeight:float = 0.2;

//-----------------------
//Static Public Variables
//-----------------------

public var playMusic:boolean;
public var jumping:boolean = false;
public var floorDetect:boolean = false;
public var downHill:boolean = false;

//Raycasting
public var rayHit:RaycastHit;
public var rayHit2:RaycastHit;
public var rayHit3:RaycastHit;

public var grounded:boolean = false;

//-----------------------
//Character Locomotion
//-----------------------
private var offsetRunSpeed:float;
private var maxSpeed:Vector3;
private var running:boolean = false;
private var jumpTimer:float = 0;
private var runSpeed:float = 10;

//-----------------------
//Character Mechanics
//-----------------------

//Character Attack
private var attacking:boolean = false;
private var attackTimer:float = 0.0;
private var hitBox:GameObject;
private var hitCollider:BoxCollider;
private var runAttackDistance:float = 0.5;
private var onlySetOnce:boolean = true;

//Other
private var playerDead:boolean = false;
private var constantSpeed:boolean = false;

private var stopSpeed:float = 100;
//private var fallOver:boolean = true;

//---------------------
//Emitters 
//---------------------

private var floorEmitter:GameObject;
private var pointEmitter:GameObject;

//---------------------
//Character Camera Follow
//---------------------

private var cameraFollow:GameObject;
private var movePos:GameObject;
private var moveRot:GameObject;

private var slowingDistance:float = 2;
private var lerpTime:float = 1;
private var currentLerpTime:float;
private var moveDistance:float;

private var startPos:Vector3;
private var endPos:Vector3;
private var camFollow:GameObject;

//Fix for downhill

function Start () {
	cameraFollow = GameObject.Find("CameraFollow");
	floorEmitter = GameObject.Find("FloorEmitter");
	pointEmitter = GameObject.Find("PointEmitter");
	movePos = GameObject.FindWithTag("PlayerPos");
	camFollow = GameObject.Find("CameraFollow");
	hitBox = GameObject.Find("PlayerHitBox");
	pointEmitter.particleSystem.emissionRate = 0;
	grounded = false;
	hitCollider = hitBox.GetComponent(BoxCollider);
	hitCollider.size = Vector3(0, 0, 0);
	hitCollider.enabled = false;
	runSpeed = 0;
}

function Update () {
	var animator: playerAnimator = GetComponent(playerAnimator); 
	var waypoints: cameraWaypoints = cameraFollow.GetComponent(cameraWaypoints); 
	pointEmitter.transform.rotation = camFollow.transform.rotation;
	floorEmitter.transform.localRotation.z = transform.localRotation.z;
	pointEmitter.transform.position.x = transform.position.x;
	floorEmitter.transform.position.x = transform.position.x;
	floorEmitter.transform.position.y = animator.hitWorldPoint.y;
	// Bit shift the index of the layer (8) to get a bit mask
	var layerMask = 1 << 8;
	// This would cast rays only against colliders in layer 8.
	// But instead we want to collide against everything except layer 8. The ~ operator does this, it inverts a bitmask.
	layerMask = ~layerMask;

	//Mid Main Ray
	var hit : RaycastHit;
	if (Physics.Raycast (transform.localPosition, -transform.up, hit, Mathf.Infinity, layerMask)) {
		//did hit
		var distGround = hit.distance;
	}else{
		//did not hit
	}
	//Front Ray
	var hit2 : RaycastHit;
	if (Physics.Raycast (transform.localPosition + Vector3(0.5,0,0), -transform.up, hit2, Mathf.Infinity, layerMask)) {
		var distGround2 = hit.distance;
	}else{
	}
	//Back Ray
	var hit3 : RaycastHit;
	if (Physics.Raycast (transform.localPosition + Vector3(-0.5,0,0), -transform.up, hit3, Mathf.Infinity, layerMask)) {
		var distGround3 = hit.distance;
	}else{
	}
	//debug the ray for testing
	Debug.DrawRay(transform.localPosition, -transform.up * distGround);
	Debug.DrawRay(transform.localPosition + Vector3(0.5,0,0), -transform.up * distGround2);
	Debug.DrawRay(transform.localPosition + Vector3(-0.5,0,0), -transform.up * distGround3);
    rayHit = hit;
    rayHit2 = hit2;
    rayHit3 = hit3;

	animator.JumpRotation();
	offsetRunSpeed = runSpeed - 4;

	if(!playerDead){
		if (Input.GetKey ('d')){
			runSpeed = waypoints.moveSpeed;
			running = true;
		}else{
			running = false;
		}

		if (Input.GetKeyDown ('space') && grounded){
			rigidbody.velocity.y = 0;
			jumping = true;
		}

		if (Input.GetKeyDown ('e')){
			attackTimer = 0;
			attacking = false;
			attacking = true;
		}

		if (Input.GetKeyUp ('space')){
			jumpTimer = 0;
			if (jumping){
				jumping = false;
			}
		}
		if(grounded && !jumping && running){
			floorEmitter.particleSystem.emissionRate = 7;
			//floorEmitter.particleSystem.startLifetime = 0.9;
			animator.FloorDetection();
		}
		if(!grounded || !running){
			//floorEmitter.particleSystem.startLifetime = 0.2;
			floorEmitter.particleSystem.emissionRate = 0;
		}
	}

}

function FixedUpdate(){
	var waypoints: cameraWaypoints = cameraFollow.GetComponent(cameraWaypoints); 
	startPos = transform.position;
    endPos = movePos.transform.position;
	moveDistance = Vector3.Distance(endPos, transform.position);
	Debug.Log(runSpeed);
	//Debug.Log(offsetRunSpeed);
	if(!playerDead){
		if(!grounded && !jumping){
			//if in the air and not in a jump apply force back down
			jumpTimer = 0;
			rigidbody.AddForce (-transform.up * gravity);
		}
		if(grounded){
			if (running){
				if (!playMusic){
					playMusic = true;
				}

				if(moveDistance * 2 <= camFollow.rigidbody.velocity.x){
					rigidbody.velocity = (transform.right * offsetRunSpeed);
				}else{
					rigidbody.velocity = (transform.right * moveDistance) * 2;
				}

			}else{

				//runSpeed = Mathf.Lerp(lastSpeed, 0, stopSpeed * Time.deltaTime * stopSmooth);
				//rigidbody.velocity = Vector3(0, 0, 0);
				rigidbody.velocity = (transform.right * runSpeed);
			}
		}else{
			if(running){
				if(moveDistance <= camFollow.rigidbody.velocity.x && !downHill){
					if(transform.eulerAngles.z < 20 && transform.eulerAngles.z >= -10 || transform.eulerAngles.z <= 360 && transform.eulerAngles.z >= 270 ){
						rigidbody.velocity.x = runSpeed;
					}
				}
			}
		}



		if(jumping){
			jumpTimer += Time.fixedDeltaTime * 10;
			Jump();
		}

		if(attacking){
			attackTimer += Time.fixedDeltaTime;
			Attack();
		}else{
			attackTimer = 0;
		}
		if(!running){
			runSpeed -= Time.deltaTime * stopSpeed;
			if(runSpeed <= 0){
				runSpeed = 0;
			}
		}
	}else{
		rigidbody.velocity = Vector3.zero;
		Application.LoadLevel ("testingWorld");
	}
}

function Jump(){
	if(jumpTimer > maxJumpHeight){
		jumping = false;
	}else{
		var xLocalVel = transform.InverseTransformDirection(rigidbody.velocity).x;

		if(!downHill){
			if(transform.eulerAngles.z < 20 && transform.eulerAngles.z >= -10 || transform.eulerAngles.z <= 360 && transform.eulerAngles.z >= 270){
				rigidbody.velocity.y = runSpeed;
			}else{
				rigidbody.velocity = rigidbody.velocity + (transform.up * 4);
			}
		}else{
			rigidbody.velocity = rigidbody.velocity + (transform.up * 4);
		}
	}
}

function Attack(){
	if(attackTimer > 0 && attackTimer < 0.5){
		renderer.material.color = Color.red;
		hitCollider.enabled = true;
		hitCollider.center = Vector3(0.17, 0, 0);
		if(grounded){
			hitCollider.size = Vector3(0.5, 0.2, 1);
		}else{
			hitCollider.size = Vector3(0.5, 0.8, 1);
		}
	}else{
		renderer.material.color = Color.green;
		hitCollider.enabled = false;
		hitCollider.size = Vector3(0, 0, 0);
		attacking = false;
	}
}

function OnTriggerEnter(other : Collider){
	if(other.gameObject.tag == 'Point'){
		pointEmitter.transform.position.y = other.transform.position.y;
		pointEmitter.particleSystem.Emit(10);
		Destroy(other.gameObject);
	}
	if(other.gameObject.tag == 'DownHill'){
		downHill = true;
	}
	if(other.gameObject.tag == 'Death'){
		playerDead = true;
	}
}

function OnTriggerExit(other:Collider){
	if(other.gameObject.tag == 'DownHill'){
		downHill = false;
	}
}
