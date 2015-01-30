#pragma strict

//Character Locomotion

private var maxSpeed:Vector3;
public var maxRunSpeed:float = 15;
public var runSpeed:float = 15;
private var running:boolean = false;

//Character Jump

public var maxJumpSpeed:float = 20;
public var jumpSpeed:float = 100;
private var jumpTimer:float = 0;

public var maxJumpHeight:float = 1;
public var jumping:boolean = false;

//Character Mechanics

public var gravity:float = 65;

public var floorDetect:boolean = false;
public var grounded:boolean = false;

public var playMusic:boolean;

private var constantSpeed:boolean = false;

public var rayHit:RaycastHit;
public var rayHit2:RaycastHit;
public var rayHit3:RaycastHit;

private var floorEmitter:GameObject;
private var pointEmitter:GameObject;

//Character Camera Follow

private var movePos:GameObject;
private var moveRot:GameObject;

private var slowingDistance:float = 2;
private var lerpTime:float = 1;
private var currentLerpTime:float;
private var moveDistance:float;

private var startPos:Vector3;
private var endPos:Vector3;
private var camFollow:GameObject;


//Character Attack
private var attacking:boolean = false;
private var attackTimer:float = 0.0;
private var hitBox:GameObject;
private var hitCollider:BoxCollider;

public var jumpAttackHeight:float = 0.8;
private var jumpAttackDistance:float = 0.5;

public var runAttackHeight:float = 0.2;
private var runAttackDistance:float = 0.5;

function Start () {

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
}

function Update () {
		Debug.Log(grounded);
	var animator: playerAnimator = GetComponent(playerAnimator); 

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

	if (Input.GetKey ('d')){
		running = true;
	}else{
		running = false;
		if(grounded){
			rigidbody.velocity = Vector3(0, 0, 0);
		}
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

function FixedUpdate(){
	startPos = transform.position;
    endPos = movePos.transform.position;
	moveDistance = Vector3.Distance(endPos, transform.position);
	
	if(!grounded && !jumping){
		//if in the air and not in a jump apply force back down
		jumpTimer = 0;
		rigidbody.AddForce (-transform.up * gravity);
	}
	if (running && grounded){
		if (!playMusic){
			playMusic = true;
		}

			/*currentLerpTime += Time.deltaTime;
			var t:float = currentLerpTime / lerpTime;
			t = 1f - Mathf.Cos(t * Mathf.PI * 0.5);
			transform.position = Vector3.Lerp(startPos, endPos, t);*/

		if(moveDistance * 2 <= camFollow.rigidbody.velocity.x){
			rigidbody.velocity = (transform.right * 20);
		}else{
			rigidbody.velocity = (transform.right * moveDistance) * 2;
		}

	}

	if(running && !grounded){
		if(moveDistance <= camFollow.rigidbody.velocity.x){
			rigidbody.velocity.x = 20;
		}else{
			//var moveDirection : Vector3 = (endPos - transform.position);

			//rigidbody.velocity.x = (moveDirection.x * moveDistance) /2;
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
}

function Jump(){
	if(jumpTimer > maxJumpHeight){
		jumping = false;
	}else{
		//rigidbody.velocity = transform.up * 24;
		rigidbody.velocity.y = 24;
		//rigidbody.AddForce(transform.up * jumpSpeed);
		
		//var maxJump = transform.up * maxJumpSpeed;

		//if (rigidbody.velocity.y > maxJump.y){
			//rigidbody.velocity.y = maxJump.y;
		//}
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
}