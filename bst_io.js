var maxNodes = 100, numBstNodes = 0;

				// objects used to run animations
var circ_bst, circ_hilite, cv_rect, cv_rect2, 
	anim_dummy, anim_hilite, anim_cv, anim_cv2;

				// objects related to insertion
var ins_grp, ins_line, ins_circ, ins_label, ins_text;

				// some preferences for tree nodes
var nodeRadius = 15, nodeSpacingX = 5, nodeSpacingY = 75;

var rootX = 400., rootY = 100.;
var rootOfBst = null;

				// animation data structures
var anim_objs = new Array();
var anim_info = new Array();
var codeViewObj = new Array();
var codeLines = new Array();
var codeRects = new Array();
var codeText = new Array();
var numBstNodes = 0;
				// keep track of total anim objects, code lines
var currAnimObj = 0, currCodeLine = 0, stepIndx = 0;

				// for codeview
var prev_cv_index = -1, cv_rect_width; 

						// bstNode class
function bstNode(val, l, r, id, x, y){
	this.val = val;
	this.left = l;			// left child
	this.right = r;			// right child

							// display related properties

	this.id = id;			// object id 
	this.x = x;				// center of node - x coord
	this.y = y;				// center of node - y coord
	this.maxWidth = 0.;

	numBstNodes++;
							// create associated SVG objects
	this.anim = null;
							// create the links
							// only known attributes are set
	this.line_l = svgDoc.createElementNS(svgNS,'line');
	this.line_l.setAttribute("id", "line_l_" + id); 
	this.line_l.setAttribute("stroke","green");
	this.line_l.setAttribute("stroke-width","3");
	this.line_l.setAttribute("visibility","hidden");
	this.line_l.setAttribute("x1", 0);
	this.line_l.setAttribute("y1", 0);
	this.line_l.setAttribute("x2", 0);
	this.line_l.setAttribute("y2", 0);

	this.line_r = svgDoc.createElementNS(svgNS, 'line');
	this.line_r.setAttribute("id", "line_r" + id); 
	this.line_r.setAttribute("stroke","green");
	this.line_r.setAttribute("stroke-width","3");
	this.line_r.setAttribute("visibility","hidden");
	this.line_r.setAttribute("x1", 0);
	this.line_r.setAttribute("y1", 0);
	this.line_r.setAttribute("x2", 0);
	this.line_r.setAttribute("y2", 0);

					// store the link lengths between parent and children
	this.llinkDist = 0.0;
	this.rlinkDist = 0.0;
							// create the node
	this.circ = svgDoc.createElementNS(svgNS, 'circle');
	this.circ.setAttribute("id", this.id); 
	this.circ.setAttribute("fill","red");
	this.circ.setAttribute("opacity","0.4");
	this.circ.setAttribute("stroke","green");
	this.circ.setAttribute("stroke-width","5");
	this.circ.setAttribute("visibility","visible");
	this.circ.setAttribute("cx", 0);
	this.circ.setAttribute("cy", 0);
	this.circ.setAttribute("r", nodeRadius);

							// create the label for the node
	this.label = svgDoc.createElementNS(svgNS, 'text');
	this.label.setAttribute("x", this.x);
	this.label.setAttribute("y", this.y);
	this.label.setAttribute("font-size","10px");
	this.label.setAttribute("text-anchor","middle");
	this.label.setAttribute("visibility","visible");

	var txt_node = svgDoc.createTextNode(this.val);
	this.label.appendChild(txt_node);

}
								// animation information object, used by 
								// all bst algorithms to record playback 
function animInfo(id, path_pts, type, animParent, x, y, hilite_obj) {
	this.id = id;
	this.path_pts = path_pts;
	this.type = type;
	if (type == 'Motion')
		this.path = 'M' + path_pts[0] + ' L' + path_pts[1];
	this.anim_parent = animParent;
					// hiliting location
	this.cx = x;
	this.cy = y;
					// for unhilite object
	this.cx2 = 0;
	this.cy2 = 0;
					// object to be hilited
	this.hilite_obj = hilite_obj;
	this.prev_cv_index = -1;

}
function buildBST(di) {
	switch(di) {
		case 'data0':  createBST(3); break;
		case 'data1':  createBST(5); break;
		case 'data2':  createBST(9); break;
	}
}
function buildCodeViewBST(method) {
	createCodeViewBST(method);
	animationInitBST(rootOfBst);
}

function createBST( numNodes ) {
	rootOfBst = loadBST (numNodes);
	var maxLevel = maxLevelBst(rootOfBst, 0);
	layoutBST(rootOfBst, 
		(Math.pow(2, maxLevel)*(2.*nodeRadius+nodeSpacingX))/2., rootX, rootY);
	getLinks(rootOfBst);
	drawBST(rootOfBst);
}


					// builds a binary search tree of numNodes with 
					// integer values in the range the range 1-200
function loadBST( numNodes ) {
					// first create root node
//	val = Math.floor(Math.random()*201);
	var k = 0;
	var vals = new Array(80, 64, 82, 95, 108, 42, 68, 39, 89, 66);
//	var vals = new Array(80, 64, 95, 108, 42, 68, 39, 89, 66);
	var val =  vals[0];
//	alert("Val[" + k + "]:" + val);
	rootOfBst = new bstNode(val, null, null, k, 0, 0);
	rootOfBst.val = val;
	rootOfBst.id = numBstNodes;
	numBstNodes++;
					// create the remaining nodes
	for (k = 1; k < numNodes; k++) {
		val = vals[k];
		root = rootOfBst;
		while (root != null) {
			if (val < root.val) {
				if (root.left == null){
					root.left = new bstNode(val, null, null, String(k), 0, 0);
					root.left.val = val;
					root.left.id = k;
					break;
				}
				else root = root.left;
			}
			else if (val > root.val){
				if (root.right == null){
					root.right = new bstNode(val, null, null, String(k), 0, 0);
					root.right.val = val;
					root.right.id = k;
					break;
				}
				else root = root.right;
			}
			else {		// duplicate value, ignore
				k--;
				break;
			}
		}
	}
	return rootOfBst;
}
function layoutBST(root, maxWidth, x, y) {
	if (root != null) {
		root.x = x;
		root.y = y;	
		root.maxWidth = maxWidth;
		layoutBST(root.left, maxWidth/2., x-maxWidth/2., y+nodeSpacingY);
		layoutBST(root.right, maxWidth/2., x+maxWidth/2., y+nodeSpacingY);
	}
}

function getLinks(root) {
	var dx, dy;
	if (root != null) {
		if (root.left != null) {
			dx = root.x - root.left.x;
			dy = root.y - root.left.y;
			root.llinkDist = Math.sqrt(dx*dx+dy*dy);
			t = nodeRadius/root.llinkDist;
			xx = root.x + t*(root.left.x-root.x);
			yy = root.y + t*(root.left.y-root.y);
			root.line_l.setAttribute("x1", xx);
			root.line_l.setAttribute("y1", yy);
			xx = root.x + (1-t)*(root.left.x-root.x);
			yy = root.y + (1-t)*(root.left.y-root.y);
			root.line_l.setAttribute("x2", xx);
			root.line_l.setAttribute("y2", yy);

			getLinks(root.left);
		}
		if (root.right != null) {
			dx = root.x - root.right.x;
			dy = root.y - root.right.y;
			root.rlinkDist = Math.sqrt(dx*dx+dy*dy);
			t = nodeRadius/root.rlinkDist;
			xx = root.x + t*(root.right.x-root.x);
			yy = root.y + t*(root.right.y-root.y);
			root.line_r.setAttribute("x1", xx);
			root.line_r.setAttribute("y1", yy);
			xx = root.x + (1-t)*(root.right.x-root.x);
			yy = root.y + (1-t)*(root.right.y-root.y);
			root.line_r.setAttribute("x2", xx);
			root.line_r.setAttribute("y2", yy);

			getLinks(root.right);
		}
	}
}
function maxLevelBst(root, level){
	if (root == null)
		return level;
	else {
		var lmax = maxLevelBst(root.left, level+1);
		var rmax = maxLevelBst(root.right, level+1);

		return (lmax > rmax)? lmax : rmax;
	}
}
function drawBST(root) {
	if (root != null)
	{
		drawNode(root);
								// recurse
		drawBST(root.left);	
		drawBST(root.right);	
	}
}
function drawNode(root) {
							// first draw the links
	var xx, yy, t;
	if (root.left != null) {
		root.line_l.setAttribute('visibility', 'visible');
		cnvs.appendChild(root.line_l);
	}
	if (root.right != null){
		root.line_r.setAttribute('visibility', 'visible');
		cnvs.appendChild(root.line_r);
	}

							// draw the node
	root.circ.setAttribute("cx", root.x);
	root.circ.setAttribute("cy", root.y);

	root.label.setAttribute("x", root.x);
	root.label.setAttribute("y", root.y);


	cnvs.appendChild(root.circ);
	cnvs.appendChild(root.label);
}

var path;

function inOrderTraverseBST (root) {
				// initialize code view line location(index)
	prev_cv_index = -1;
	inOrderTraverseBST_R (root);
}
function inOrderTraverseBST_R(root) {
	codeViewAnim(prev_cv_index, 0);
	codeViewAnim(prev_cv_index, 1);
	if (root != null) {
									// follow left path 
		codeViewAnim(prev_cv_index, 2);
		if (root.left != null)
			createMotionAnimObj(getPathPoints(root, root.left));
		inOrderTraverseBST_R(root.left);
		if (root.left != null)
			createMotionAnimObj(getPathPoints(root.left, root));
							// must highlight the node here
		codeViewAnim(prev_cv_index, 3);
		createAnimateObj(root);

									// follow right path 
		codeViewAnim(prev_cv_index, 4);
		if (root.right != null)
			createMotionAnimObj(getPathPoints(root, root.right));
		inOrderTraverseBST_R(root.right);
		if (root.right != null)
			createMotionAnimObj(getPathPoints(root.right, root));
	}
	codeViewAnim(prev_cv_index, 5);
	codeViewAnim(prev_cv_index, 6);
}
								// preorder traversal
function preOrderTraverseBST (root) {
				// initialize code view line location(index)
	prev_cv_index = -1;
	preOrderTraverseBST_R (root);
}
function preOrderTraverseBST_R(root) {
	codeViewAnim(prev_cv_index, 0);
	codeViewAnim(prev_cv_index, 1);
	if (root != null) {
							// must highlight the node here
		codeViewAnim(prev_cv_index, 2);
		createAnimateObj(root);
									// follow left path 
		codeViewAnim(prev_cv_index, 3);
		if (root.left != null)
			createMotionAnimObj(getPathPoints(root, root.left));
		preOrderTraverseBST_R(root.left);
		if (root.left != null)
			createMotionAnimObj(getPathPoints(root.left, root));

									// follow right path 
		codeViewAnim(prev_cv_index, 4);
		if (root.right != null)
			createMotionAnimObj(getPathPoints(root, root.right));
		preOrderTraverseBST_R(root.right);
		if (root.right != null)
			createMotionAnimObj(getPathPoints(root.right, root));
	}
	codeViewAnim(prev_cv_index, 5);
	codeViewAnim(prev_cv_index, 6);
}
function postOrderTraverseBST (root) {
				// initialize code view line location(index)
	prev_cv_index = -1;
	postOrderTraverseBST_R (root);
}
function postOrderTraverseBST_R(root) {
	codeViewAnim(prev_cv_index, 0);
	codeViewAnim(prev_cv_index, 1);
	if (root != null) {
									// follow left path 
		codeViewAnim(prev_cv_index, 2);
		if (root.left != null)
			createMotionAnimObj(getPathPoints(root, root.left));
		postOrderTraverseBST_R(root.left);
		if (root.left != null)
			createMotionAnimObj(getPathPoints(root.left, root));

									// follow right path 
		codeViewAnim(prev_cv_index, 3);
		if (root.right != null)
			createMotionAnimObj(getPathPoints(root, root.right));
		postOrderTraverseBST_R(root.right);
		if (root.right != null)
			createMotionAnimObj(getPathPoints(root.right, root));

							// must highlight the node here
		codeViewAnim(prev_cv_index, 4);
		createAnimateObj(root);
		
	}
	codeViewAnim(prev_cv_index, 5);
	codeViewAnim(prev_cv_index, 6);
}
function createMotionAnimObj(path_pts) {
						// load anim info array
	anim_info[currAnimObj] = new animInfo(currAnimObj, path_pts, 
					'Motion', 'circ_bst', 0, 0, null);
	currAnimObj++;
}

function createAnimateObj(root) {
						// load anim info array
	anim_info[currAnimObj] = new animInfo(currAnimObj, "", 'Hilite', 
					'circ_hilite', root.x, root.y, root.circ);
	currAnimObj++;
}
function animationInitBST(root) {
				// a small filled circle animated over the tree paths
	circ_bst = svgDoc.createElementNS(svgNS, 'circle');
        circ_bst.setAttribute("id", "motion_circ_bst"); 
        circ_bst.setAttribute("fill","white");
        circ_bst.setAttribute("stroke","black");
        circ_bst.setAttribute("stroke-width","2");
        circ_bst.setAttribute("cx", rootX);
        circ_bst.setAttribute("cy", rootY);
        circ_bst.setAttribute("r", "5");
								// create a rectangle for animation
	anim_motion = svgDoc.createElementNS(svgNS, 'animateMotion');
        anim_motion.setAttribute("id", 'anim_motion');
        anim_motion.setAttribute("path", 'M0,0 L0,0');
        anim_motion.setAttribute("dur", "2s");
        anim_motion.setAttribute("fill", "freeze");
        anim_motion.setAttribute("begin", "0s");

	circ_hilite = svgDoc.createElementNS(svgNS, 'circle');
        circ_hilite.setAttribute("id", "circ_hilite"); 
        circ_hilite.setAttribute("fill","red");
        circ_hilite.setAttribute("stroke","black");
        circ_hilite.setAttribute("stroke-width","2");
        circ_hilite.setAttribute("cx", rootX);
        circ_hilite.setAttribute("cy", rootY);
        circ_hilite.setAttribute("r", "15");
        circ_hilite.setAttribute("visibility", "hidden");

	anim_hilite = svgDoc.createElementNS(svgNS,'animate');
    	anim_hilite.setAttribute("id", 'anim_hilite');
    	anim_hilite.setAttribute("attributeName", "opacity");
    	anim_hilite.setAttribute("attributeType", "CSS");
    	anim_hilite.setAttribute("dur", "1s");
    	anim_hilite.setAttribute("fill", "freeze");
    	anim_hilite.setAttribute("from", "0.0");
    	anim_hilite.setAttribute("to", "0.5");
    	anim_hilite.setAttribute("begin", "playBtn.click");

	circ_hilite.appendChild (anim_hilite);

	if (stepActive) {
		circ_bst.appendChild(anim_motion);
		circ_hilite.appendChild(anim_hilite);
	}


								// get the width of rectangles from cv panel
	cv_rect_width = svgDoc.getElementById("codeviewRect").getAttribute('width');

	cv_rect = svgDoc.createElementNS(svgNS, 'rect');
		cv_rect.setAttribute("id", "cv_rect");
		cv_rect.setAttribute("x", codeRects[0].getAttribute('x'));
		cv_rect.setAttribute("y", codeRects[0].getAttribute('y'));
		cv_rect.setAttribute("width", cv_rect_width);
		cv_rect.setAttribute("height", "30");
		cv_rect.setAttribute("fill", "red");
		cv_rect.setAttribute("opacity", "0.3");

	anim_cv = svgDoc.createElementNS(svgNS, 'animateMotion');
        anim_cv.setAttribute("id", 'anim_cv');
        anim_cv.setAttribute("path", 'M0,0 L0,0');
        anim_cv.setAttribute("dur", "1s");
        anim_cv.setAttribute("fill", "freeze");
        anim_cv.setAttribute("begin", "playBtn.click");

	cv_rect.appendChild(anim_cv);

							// objects associated with insertion operation
	ins_grp = svgDoc.createElementNS(svgNS, 'g');
	ins_line = svgDoc.createElementNS(svgNS, 'line');
		ins_line.setAttribute("id", "ins_line"); 
		ins_line.setAttribute("stroke","green");
		ins_line.setAttribute("stroke-width","3");
		ins_line.setAttribute("opacity","0.0");

							// create the node
	ins_circ= svgDoc.createElementNS(svgNS, 'circle');
		ins_circ.setAttribute("id", "ins_circ"); 
		ins_circ.setAttribute("fill","red");
		ins_circ.setAttribute("opacity","0.4");
		ins_circ.setAttribute("stroke","green");
		ins_circ.setAttribute("stroke-width","5");
		ins_circ.setAttribute("r", nodeRadius);
		ins_circ.setAttribute("opacity","0.0");
	
	ins_label = svgDoc.createElementNS(svgNS, 'text');
		ins_label.setAttribute("font-size","10px");
		ins_label.setAttribute("text-anchor","middle");
		ins_label.setAttribute("opacity","0.0");

//	ins_text = svgDoc.createTextNode("");
//	var txt_node = svgDoc.createTextNode("");
//	ins_label.appendChild(txt_node);

	ins_anim = svgDoc.createElementNS(svgNS,'animate');
        ins_anim.setAttribute("id", 'ins_anim');
        ins_anim.setAttribute("attributeName", "opacity");
        ins_anim.setAttribute("attributeType", "CSS");
        ins_anim.setAttribute("dur", "2s");
        ins_anim.setAttribute("fill", "freeze");
        ins_anim.setAttribute("from", "0.0");
        ins_anim.setAttribute("to", "1.0");

	ins_grp.appendChild(ins_line);
	ins_grp.appendChild(ins_circ);
	ins_grp.appendChild(ins_label);
//	ins_grp.setAttribute('opacity', '0.0');
//	ins_grp.appendChild(ins_anim);
}
function getPathPoints(from, to) {
	var pt1 = [from.x - rootX, from.y - rootY];
	var pt2 = [to.x - rootX, to.y - rootY];

	return [pt1,pt2];
}
function stepInitBST(opSelection) {
						// run the algorithm to create presentation
	switch (opSelection) {
		case 'inorder': 
				inOrderTraverseBST(rootOfBst);
				break;
		case 'preorder': 
				preOrderTraverseBST(rootOfBst);
				break;
		case 'postorder': 
				postOrderTraverseBST(rootOfBst);
				break;
		case 'find':
				findValBST(rootOfBst, 89);
				break;
		case 'insert':
				insertValBST(rootOfBst, 89);
				break;
		default:
				alert(opSelection + '  not implemented.');
				return;
	}
	stepIndx = 0;
	cnvs.appendChild(circ_bst);
	cnvs.appendChild(circ_hilite);
	cv_grp.appendChild(cv_rect);
}
function processStep() {
	var obj, j, par;
	if (stepIndx == currAnimObj) {
					// remove the anim objects from DOM and return
		currAnimObj = 0;			// no anim objects in DOM tree
		stepActive = 0;
		return;
	}

	if (anim_info[stepIndx].type == 'Motion') {
		circ_hilite.setAttribute('visibility', 'hidden');
		circ_bst.setAttribute('visibility', 'visible');
		anim_cv.setAttribute('path', '');
		cv_rect.setAttribute('y', anim_info[stepIndx-1].cy);
		anim_motion.setAttribute('path', anim_info[stepIndx].path);
		anim_motion.setAttribute('begin', 'playBtn.click');
	}
	else if (anim_info[stepIndx].type == 'Hilite') {
		circ_bst.setAttribute('visibility', 'hidden');
		anim_cv.setAttribute('path', '');
		cv_rect.setAttribute('y', anim_info[stepIndx-1].cy);
		circ_hilite.setAttribute('cx', anim_info[stepIndx].cx);
		circ_hilite.setAttribute('cy', anim_info[stepIndx].cy);
		circ_hilite.setAttribute('visibility', 'visible');

						// want to leave nodes highlighted
		var r = anim_info[stepIndx].hilite_obj;
		r.setAttribute('opacity', '0.7');
	}
	else if (anim_info[stepIndx].type == 'CodeHilite') {
		circ_bst.setAttribute('visibility','hidden');
		circ_hilite.setAttribute('visibility','hidden');
							//hiliting current code line
		if (stepIndx == 0) {
			cv_rect.setAttribute('x', anim_info[stepIndx].cx);
			cv_rect.setAttribute('y', anim_info[stepIndx].cy);
		}
		else {			// move from old to new position
//alert('cx,cy..' + anim_info[stepIndx].cx + ',' + anim_info[stepIndx].cy);
//alert('cx2,cy2..' + anim_info[stepIndx].cx2 + ',' + anim_info[stepIndx].cy2);
			cv_rect.setAttribute('x', anim_info[stepIndx].cx2);
			cv_rect.setAttribute('y', anim_info[stepIndx].cy2);
			var dy = anim_info[stepIndx].cy - anim_info[stepIndx].cy2;
			anim_cv.setAttribute('path', 'M0,0 ' + 'L0,' + dy);
//alert('path..');
		}
	}
	stepIndx++;
}

function runInitBST(opSelection){
						// run the tree algorithm to create presentation
	switch (opSelection) {
		case 'inorder': 
				inOrderTraverseBST(rootOfBst);
				break;
		case 'preorder': 
				preOrderTraverseBST(rootOfBst);
				break;
		case 'postorder': 
				postOrderTraverseBST(rootOfBst);
				break;
		case 'find':
				findValBST(rootOfBst, 89);
				break;
		case 'insert':
				insertValBST(rootOfBst, 81);
				break;
		default:
				alert(opSelection + '  not implemented.');
				return;
	}
						// create the animation objects
	var i;
						// put cv-rect at the first code line
	var cv_rect_origin = [anim_info[0].cx, anim_info[0].cy];
	cv_rect.setAttribute('x', anim_info[0].cx);
	cv_rect.setAttribute('y', anim_info[0].cy);
	for (i = 0; i < currAnimObj; i++){
		var j = i-1;
		if (anim_info[i].type == 'Motion') {
			anim_objs[i] = svgDoc.createElementNS(svgNS,'animateMotion');
			anim_objs[i].setAttribute("id", 'anim_objs_' + i);
			anim_objs[i].setAttribute("path", 'M' + anim_info[i].path_pts[0] 
								+ ' L' + anim_info[i].path_pts[1]);
			anim_objs[i].setAttribute("dur", "2s");
			anim_objs[i].setAttribute("fill", "freeze");
			if (i == 0)		// first object, play on mouse click
				anim_objs[i].setAttribute("begin", "playBtn.click");
			else 
				anim_objs[i].setAttribute("begin", "anim_objs_" + j + ".end");
							// add the animation node 
			circ_bst.appendChild(anim_objs[i]);
		}
		else if (anim_info[i].type == 'Hilite') {
			anim_objs[i] = svgDoc.createElementNS(svgNS,'animate');
			anim_objs[i].setAttribute("id", 'anim_objs_' + i);
			anim_objs[i].setAttribute("attributeName", "opacity");
			anim_objs[i].setAttribute("attributeType", "CSS");
			anim_objs[i].setAttribute("dur", "0.25s");
			anim_objs[i].setAttribute("fill", "freeze");
			anim_objs[i].setAttribute("from", "0.0");
			anim_objs[i].setAttribute("to", "1.0");
			if (i == 0)		// first object, play on mouse click
				anim_objs[i].setAttribute("begin", "playBtn.click");
			else 
				anim_objs[i].setAttribute("begin", "anim_objs_" + j + ".end");
							// add the animation node to the tree node
//alert('hilite obj:' + anim_info[i].hilite_obj);
//alert('anim obj:' + anim_objs[i]);
			anim_info[i].hilite_obj.appendChild(anim_objs[i]);
		}
		else if (anim_info[i].type == 'CodeHilite') {
			anim_objs[i] = svgDoc.createElementNS(svgNS, 'animateMotion');
			anim_objs[i].setAttribute("id", 'anim_objs_' + i);
			anim_objs[i].setAttribute("dur", "1s");
			anim_objs[i].setAttribute("fill", "freeze");
			if (i == 0){		// first object
				anim_objs[i].setAttribute("begin", "playBtn.click");
				anim_objs[i].setAttribute('path', 'M0,0 L0,0');
				cv_rect.appendChild(anim_objs[i]);
			}
			else {
				var dy = anim_info[i].cy - anim_info[i].cy2;
				pt1 = [0, anim_info[i].cy2 - cv_rect_origin[1] ];
				pt2 = [0, anim_info[i].cy  - cv_rect_origin[1] ];
				var mpath = 'M0,' + pt1[1] + ' L0,' + pt2[1];
				anim_objs[i].setAttribute('path', mpath);
				var begin_time = 'anim_objs_' + j + '.end' + '+0.3s';
				anim_objs[i].setAttribute("begin", begin_time);
				cv_rect.appendChild(anim_objs[i]);
			}
		}
		else
			alert ('Error: Undefined object type!');
	}
							// some operations need tree structure to 
							// be updated (insert, delete)
	switch (opSelection) {
		case 'insert':
			anim_objs[currAnimObj-1].setAttribute('onend', 'insertBstUpdate()');
			break;
		case 'delete':
			break;
	}
						// last object will do cleanup
	circ_bst.setAttribute('cx', rootX);
	circ_bst.setAttribute('cy', rootY);
	circ_bst.setAttribute('visibility', 'visible');
	cnvs.appendChild(circ_bst);
//	cnvs.appendChild(ins_grp);
	cnvs.appendChild(ins_line);
	cnvs.appendChild(ins_circ);
	cnvs.appendChild(ins_label);
	cv_grp.appendChild(cv_rect);
}
function resetProc() {
					// remove all animation objects created in run mode
	removeAnimObjects();

	circ_bst.setAttribute('cx', rootX);
	circ_bst.setAttribute('cy', rootY);

					// set node opacities to default
	resetNodeOpacities_R(rootOfBst);
}
function resetNodeOpacities_R(root) {
	if (root != null){
		root.circ.setAttribute('opacity', '0.4');

		resetNodeOpacities_R(root.left);
		resetNodeOpacities_R(root.right);
	}
}

function cleanupBST(cleanup_type) {
						// remove animation and related objects
	switch (cleanup_type) {
		case 'DS': 	
			removeAnimObjects();
			removeTreeObjects();
			removeCodeViewObjects();
			break;
		case 'OP':
			removeAnimObjects();
			removeCodeViewObjects();
			break;
		case 'DI':
			removeAnimObjects();
			removeTreeObjects();
			break;
	}
}

function removeAnimObjects() {
					// remove all animation objects created in run mode
	var i, obj;
	for (i = 0; i < currAnimObj; i++) {
		obj = svgDoc.getElementById('anim_objs_' + i);
		if (obj != null)
			obj.parentNode.removeChild(obj);
	}
	currAnimObj = 0;
					//remove step mode and codeview anim objects

	obj = svgDoc.getElementById('motion_circ_bst');
	if (obj != null)
		obj.parentNode.removeChild(obj);
	obj = svgDoc.getElementById('circ_hilite');
	if (obj != null)
		obj.parentNode.removeChild(obj);
	obj = svgDoc.getElementById('cv_rect');
	if (obj != null)
		obj.parentNode.removeChild(obj);
}
function removeTreeObjects() {
						// remove tree objects
	removeBST(rootOfBst);
	rootOfBst = null;
}
function removeCodeViewObjects() {
						// remove codeview objects
	for (var i = 0; i < currCodeLine; i++)
		cv_grp.removeChild(codeViewObj[i]);

	currCodeLine = 0;
}
function removeBST(root) {
	if (root != null) {
		cnvs.removeChild(root.circ);
		cnvs.removeChild(root.label);
		if (root.left) {
			cnvs.removeChild(root.line_l);
			removeBST(root.left);
		}
		if (root.right) {
			cnvs.removeChild(root.line_r);
			removeBST(root.right);
		}
	}
	delete root;
}
function codeViewAnim(prev_index, index) {
	var hilite_obj = codeRects[index];

	anim_info[currAnimObj] = new animInfo(currAnimObj, null, 'CodeHilite', 
				'cv_rect', codeRects[index].getAttribute('x'),
				codeRects[index].getAttribute('y'), hilite_obj);

	if (prev_index >= 0) {
		anim_info[currAnimObj].cx2 = codeRects[prev_index].getAttribute('x');
		anim_info[currAnimObj].cy2 = codeRects[prev_index].getAttribute('y');
	}
								// load anim info array

	prev_cv_index = index;
	currAnimObj++;
}
function createCodeViewBST(method) {
	switch (method) {
		case 'inorder':	
			getCodeViewObj("void InOrderBST(bstNode root) {", 0);
			getCodeViewObj("if (root != NULL){", 1);
			getCodeViewObj("InOrderBST(root.left);", 2);
			getCodeViewObj("visit(root);", 2);
			getCodeViewObj("InOrderBST(root.right);", 2);
			getCodeViewObj("}", 1);
			getCodeViewObj("}", 0);
			break;

		case 'preorder':
			getCodeViewObj("void PreOrderBST(bstNode root) {", 0);
			getCodeViewObj("if (root != NULL){", 1);
			getCodeViewObj("visit(root);", 2);
			getCodeViewObj("PreOrderBST(root.left);", 2);
			getCodeViewObj("PreOrderBST(root.right);", 2);
			getCodeViewObj("}", 1);
			getCodeViewObj("}", 0);
			break;

		case 'postorder':
			getCodeViewObj("void PostOrderBST(bstNode root) {", 0);
			getCodeViewObj("if (root != NULL){", 1);
			getCodeViewObj("PostOrderBST(root.left);", 2);
			getCodeViewObj("PostOrderBST(root.right);", 2);
			getCodeViewObj("visit(root);", 2);
			getCodeViewObj("}", 1);
			getCodeViewObj("}", 0);
			break;
		case 'find':
			getCodeViewObj("boolean Find(bstNode root, int val) {", 0);
			getCodeViewObj("found = false;", 1);
			getCodeViewObj("while (root != null && !found) {", 1);
			getCodeViewObj("if (val == root.val)", 2);
			getCodeViewObj("found = true;", 3);
			getCodeViewObj("else if (val < root.val)", 2);
			getCodeViewObj("root = root.left;", 3);
			getCodeViewObj("else root = root.right;", 2);
			getCodeViewObj("}", 1);
			getCodeViewObj("return found;", 1);
			getCodeViewObj("}", 0);
			break;
		case 'insert':
			getCodeViewObj("Insert(bstNode root, int val) {", 0);
			getCodeViewObj("parent = null;", 1);
			getCodeViewObj("while (root != null && !found) {", 1);
			getCodeViewObj("if (val == root.val)  \/\/ val exists, exit", 2);
			getCodeViewObj("return;", 3);
			getCodeViewObj("else if (val < root.val && root.left != NULL)", 2);
			getCodeViewObj("parent = root; root = root.left;", 3);
			getCodeViewObj("else if (val > root.val && root.right != NULL)", 2);
			getCodeViewObj("parent = root; root = root.right;", 3);
			getCodeViewObj("else found = true;", 2);
			getCodeViewObj("}", 1);
			getCodeViewObj("if (found) {", 1);
			getCodeViewObj("if (val < parent.val)", 2);
			getCodeViewObj("parent.left = new bstNode(val, null, null);", 3);
			getCodeViewObj("else", 2);
			getCodeViewObj("parent.right = new bstNode(val, null, null);", 3);
			getCodeViewObj("}", 2);
			getCodeViewObj("}", 1);
			getCodeViewObj("}", 0);
			break;
		case 'delete':
			alert('Not implemented yet..');
			break;
	}
}
function getCodeViewObj(code_line, numIndents) {
	var i = currCodeLine;
	var x_offset = 5;
	var y_offset = 100, indentSize = 25;
	var t_offset_y = 25;
	var xpos, ypos;
	var rect_ht = 30;

								// get the width of rectangles from cv panel
	cv_rect_width = svgDoc.getElementById("codeviewRect").getAttribute('width');
	var x_indent = numIndents*indentSize;
	if (x_indent > 0) 
		xpos = x_offset + numIndents*indentSize;
	else xpos = x_offset;
	var ypos = i*rect_ht + y_offset;
	codeViewObj[i] = svgDoc.createElementNS(svgNS, 'g');
		codeViewObj[i].setAttribute('id', 'g_'+ i);
	codeRects[i] = svgDoc.createElementNS(svgNS, 'rect');
		codeRects[i].setAttribute('id', 'code_rects_' + i);
		codeRects[i].setAttribute('x', '1');
		codeRects[i].setAttribute('y', String(ypos));
		codeRects[i].setAttribute('width', cv_rect_width);
		codeRects[i].setAttribute('height', '30');
		codeRects[i].setAttribute('rx', '10');
		codeRects[i].setAttribute('ry', '10');
		codeRects[i].setAttribute('fill', 'red');
		codeRects[i].setAttribute('opacity', '0.05');
	codeText[i] = svgDoc.createElementNS(svgNS, 'text');
		codeText[i].setAttribute('id', 'code_text_' + i);
		codeText[i].setAttribute('x', String(xpos));
		codeText[i].setAttribute('y', String(ypos + t_offset_y));
		codeText[i].setAttribute("style", "text-anchor:left;dominate-baseline:mathematical;font-family:Arial; font-weight:normal;fill:black;font-size:18");
		codeText[i].appendChild(svgDoc.createTextNode(code_line));

		codeViewObj[i].appendChild(codeText[i]);
		codeViewObj[i].appendChild(codeRects[i]);
		
							// add to the code view
	cv_grp.appendChild(codeViewObj[i]);
	currCodeLine++;
}
function createInsAnimObjs(link, child) {
	ins_line.setAttribute("x1", link.getAttribute('x1'));
	ins_line.setAttribute("y1", link.getAttribute('y1'));
	ins_line.setAttribute("x2", link.getAttribute('x2'));
	ins_line.setAttribute("y2", link.getAttribute('y2'));

	ins_circ.setAttribute("cx", child.x);
	ins_circ.setAttribute("cy", child.y);
	
	ins_label.setAttribute("x", child.x);
	ins_label.setAttribute("y", child.y);

	var txt_node = svgDoc.createTextNode(child.val);
	ins_label.appendChild(txt_node);

	anim_info[currAnimObj] = new animInfo(currAnimObj, "", 'Hilite',
			'ins_grp', root.x, root.y, ins_line); 
	currAnimObj++;
	anim_info[currAnimObj] = new animInfo(currAnimObj, "", 'Hilite',
			'ins_grp', root.x, root.y, ins_circ); 
	currAnimObj++;
	anim_info[currAnimObj] = new animInfo(currAnimObj, "", 'Hilite',
			'ins_grp', root.x, root.y, ins_label); 
	currAnimObj++;

/*
					// should be able to do this with the group, need to degbug!
	anim_info[currAnimObj] = new animInfo(currAnimObj, "", 'Hilite',
			'ins_grp', root.x, root.y, ins_grp); 
	currAnimObj++;
*/
}
