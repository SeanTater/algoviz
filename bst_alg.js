function findValBST (root, val) {
	codeViewAnim(prev_cv_index, 0);
    codeViewAnim(prev_cv_index, 1);
    codeViewAnim(prev_cv_index, 2);
	var found = false;
//	createAnimateObj(root);
	while (root != null && !found) {
    	codeViewAnim(prev_cv_index, 2);
							// must highlight the node here
		createAnimateObj(root);
    	codeViewAnim(prev_cv_index, 3);
		if (val == root.val) {
			found = true;
    		codeViewAnim(prev_cv_index, 8);
		}
		else {
    		codeViewAnim(prev_cv_index, 5);
			if (val < root.val) { 		
							// follow left path 
				if (root.left != null) 
					createMotionAnimObj(getPathPoints(root, root.left));
    			codeViewAnim(prev_cv_index, 6);
				root = root.left;
    			codeViewAnim(prev_cv_index, 8);
			}
			else { 
    			codeViewAnim(prev_cv_index, 7);
				if (root.right != null)
					createMotionAnimObj(getPathPoints(root, root.right));
				root = root.right;
    			codeViewAnim(prev_cv_index, 8);
			}
		}
	}
   	codeViewAnim(prev_cv_index, 9);
   	codeViewAnim(prev_cv_index, 10);

	return found;
}
function insertValBST (root, val) {
	var parX, parY, chldX, chldY, insertPoint;
	parX = root.x - rootX;
	parY = root.y - rootY;

							// search for the insertion point
	codeViewAnim(prev_cv_index, 0);
	codeViewAnim(prev_cv_index, 1);
	codeViewAnim(prev_cv_index, 2);
	var found = false;
	while (root != null && !found) {
							// must highlight the node here
		createAnimateObj(root);
		codeViewAnim(prev_cv_index, 3);
		if (val == root.val) {
			codeViewAnim(prev_cv_index, 4);
			return;
		}
		else if (val < root.val && root.left != null){
			codeViewAnim(prev_cv_index, 5);
			createMotionAnimObj(getPathPoints(root, root.left));
			codeViewAnim(prev_cv_index, 6);
			root = root.left;
		}
		else if (val > root.val && root.right != null){
								// follow right path
			codeViewAnim(prev_cv_index, 7);
			createMotionAnimObj(getPathPoints(root, root.right));
			codeViewAnim(prev_cv_index, 8);
			root = root.right;
		}
		else {					// found insertion point
			codeViewAnim(prev_cv_index, 9);
			insertPoint = root;
			found = true;
		}
	}
	codeViewAnim(prev_cv_index, 10);
	codeViewAnim(prev_cv_index, 11);
	if (found) {			// can insert the new value
							// create a node
		parX = insertPoint.x - rootX;
		parY = insertPoint.y - rootY;
		var new_node = new bstNode(val, null, null, String(numBstNodes), 0., 
						insertPoint.y+nodeSpacingY);
		numBstNodes++;
		new_node.maxWidth = insertPoint.maxWidth/2.;
		var branch = '';
		if (val < insertPoint.val)	{
			codeViewAnim(prev_cv_index, 12);
			codeViewAnim(prev_cv_index, 13);
			new_node.x = insertPoint.x - new_node.maxWidth;
			insertPoint.left = new_node;
			chldX = insertPoint.left.x - rootX;
			chldY = insertPoint.left.y - rootY;
			new_node.line_l.setAttribute('x1', parX);
			new_node.line_l.setAttribute('y1', parY);
			new_node.line_l.setAttribute('x2', chldX);
			new_node.line_l.setAttribute('y2', chldY);
			cnvs.appendChild(insertPoint.line_l);
		}
		else {
			codeViewAnim(prev_cv_index, 14);
			codeViewAnim(prev_cv_index, 15);
			new_node.x = insertPoint.x + new_node.maxWidth;
			insertPoint.right = new_node;
			chldX = insertPoint.right.x - rootX;
			chldY = insertPoint.right.y - rootY;
			new_node.line_r.setAttribute('x1', parX);
			new_node.line_r.setAttribute('y1', parY);
			new_node.line_r.setAttribute('x2', chldX);
			new_node.line_r.setAttribute('y2', chldY);
			cnvs.appendChild(insertPoint.line_r);
		}
		codeViewAnim(prev_cv_index, 17);
		codeViewAnim(prev_cv_index, 18);
		new_node.circ.setAttribute('cx', new_node.x);
		new_node.circ.setAttribute('cy', new_node.y);
		new_node.label.setAttribute('x', new_node.x);
		new_node.label.setAttribute('y', new_node.y);

		new_node.circ.setAttribute('visibility', 'hidden');
		new_node.label.setAttribute('visibility', 'hidden');
		cnvs.appendChild(new_node.circ);
		cnvs.appendChild(new_node.label);
		getLinks(insertPoint);

		if (val < insertPoint.val)
			createInsAnimObjs(insertPoint.line_l, new_node);
		else
			createInsAnimObjs(insertPoint.line_r, new_node);
	}
}
function insertBstUpdate() {
	insertBstUpdate_R(rootOfBst);
}
function insertBstUpdate_R(root) {
						// permanently updates the tree with the new node
						// after an insertion operation
	if (root != null) {
		root.circ.setAttribute('visibility', 'visible');
		root.label.setAttribute('visibility', 'visible');
		if (root.left != null) {
			root.line_l.setAttribute('visibility', 'visible');
		}
		if (root.right != null)
			root.line_r.setAttribute('visibility', 'visible');

		insertBstUpdate_R(root.left);
		insertBstUpdate_R(root.right);
	}
}
