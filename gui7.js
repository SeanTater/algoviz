							// svg Doc globals
var svgDoc, svgNS;
							// anim control variables
var playActive, stepActive, runActive, resetActive;
							// svg Doc object pointers
var cnvs, cv_grp;

							// gui variables

var dsArray, opArray, diArray;

						// keep track of current data structure
						// for initialization, cleanup
var current_ds = '';
var current_op = '';
var current_di = '';

function init(evt) {
	svgNS='http://www.w3.org/2000/svg';
	svgDoc=evt.target.ownerDocument;
	playActive =0;
	stepActive=1;
	runActive=1;
	resetActive=0;
	
	dsSelection = 'bst';
	opSelection = 'inorder';
	diSelection = 'data0';
								// get panel objects
	
	cnvs = svgDoc.getElementById("canvas");
	cv_grp =svgDoc.getElementById("codeview");

	opArray=['#opBtn_inorder','#opBtn_preorder','#opBtn_postorder','#opBtn_insert','#opBtn_delete','#opBtn_find']

	//-------------------------  CODEVIEW and CANVAS INITIALIZATION --------
	
	createDataStructure(dsSelection, diSelection, 'DS');
	createCodeView(dsSelection, opSelection);
	
	// ----------------------- SCALING ----------------
	var sW=screen.width;
	var sH=screen.height;

	var rid=svgDoc.getElementById("main");
	var rW=rid.getAttribute('width');
	var rH=rid.getAttribute('height');
	//alert(rW + '   ' + rH);
	
	var sf=sW*0.70/rW;   // 70% of screen width
//	var sf=sW/rW;   // 70% of screen width
	//alert(sf);
	
	var srW=rW*sf;
	var srH= rH*sf;
	var srA=srH/srW;

	var bW=srW + 30;
	var bH=bW*srA + 130;
	
	//window.resizeTo(bW , bH);
	
	svgDoc.getElementById('main').setAttribute('transform', 'scale(' + sf + ')' );
	//svgDoc.getElementById('svg').setAttribute('transform','scale('+sf+')' );

}
function dsSelector(evt) {
	
	dsSelection='bst';
	
	svgDoc.getElementById('dsb0').setAttribute('xlink:href', '#dsBtn_bst');
	svgDoc.getElementById('dsb1').setAttribute('xlink:href', '#dsBtn_graph');
	svgDoc.getElementById('dsb2').setAttribute('xlink:href', '#dsBtn_heap');

	id=evt.target.getAttribute('id');

	if (id=='dsb0'){
		svgDoc.getElementById('dsb0').setAttribute('xlink:href', '#dsBtn_bst_active');
	}
	else if(id=='dsb1'){
		svgDoc.getElementById('dsb1').setAttribute('xlink:href', '#dsBtn_graph_active');
		dsSelection='graph';	
	}
	else if(id=='dsb2'){
		svgDoc.getElementById('dsb2').setAttribute('xlink:href', '#dsBtn_heap_active');
		dsSelection='heap';
	}
	else {
		alert('Data structure not found');
	}

	loadOperations(id);
	
	createDataStructure(dsSelection, diSelection, 'DS');
	createCodeView(dsSelection, opSelection );
}

function opSelector(evt) {
	var  i, id;
	
	opSelection=opArray[0].split('_')[1];
	
	for (i=0; i < opArray.length; i++){
		svgDoc.getElementById('opb'+i).setAttribute('xlink:href', opArray[i]);
	}

	id=evt.target.getAttribute('id');

	if (id=='opb0'){
		svgDoc.getElementById(id).setAttribute('xlink:href', opArray[0]+'_active');
	}
	else if(id=='opb1'){
		svgDoc.getElementById(id).setAttribute('xlink:href', opArray[1]+'_active');
		opSelection=opArray[1].split('_')[1];
	}
	else if(id=='opb2'){
		svgDoc.getElementById(id).setAttribute('xlink:href', opArray[2]+'_active');
		opSelection=opArray[2].split('_')[1];
	}
	else if(id=='opb3'){
		svgDoc.getElementById(id).setAttribute('xlink:href', opArray[3]+'_active');
		opSelection=opArray[3].split('_')[1];
	}
	else if(id=='opb4'){
		svgDoc.getElementById(id).setAttribute('xlink:href', opArray[4]+'_active');
		opSelection=opArray[4].split('_')[1];
	}
	else if(id=='opb5'){
		svgDoc.getElementById(id).setAttribute('xlink:href', opArray[5]+'_active');
		opSelection=opArray[5].split('_')[1];
	}
	else {
		alert('Operation not found');
	}
	
	createCodeView(dsSelection, opSelection);
}
	
function diSelector(evt){

	diSelection='data0';
		
	svgDoc.getElementById('dib0').setAttribute('xlink:href', '#diBtn_data0');
	svgDoc.getElementById('dib1').setAttribute('xlink:href', '#diBtn_data1');
	svgDoc.getElementById('dib2').setAttribute('xlink:href', '#diBtn_data2');

	id=evt.target.getAttribute('id');

	if (id=='dib0'){
		svgDoc.getElementById('dib0').setAttribute('xlink:href', '#diBtn_data0_active');
	}
	else if(id=='dib1'){
		svgDoc.getElementById('dib1').setAttribute('xlink:href', '#diBtn_data1_active');
		diSelection='data1';
	}
	else if(id=='dib2'){
		elem=svgDoc.getElementById('dib2').setAttribute('xlink:href', '#diBtn_data2_active');
		diSelection='data2';
	}
	else {
		alert('Data set not found');
	}

	createDataStructure(dsSelection, diSelection, 'DI');
}

function loadOperations(id){
	var elem, i;

	for ( i = 0; i < 6; i++){
		svgDoc.getElementById('opb' + i).setAttribute('xlink:href','null');
	}

	if (id=='dsb0'){  //bst
		svgDoc.getElementById('opb0').setAttribute('xlink:href','#opBtn_inorder_active');
		svgDoc.getElementById('opb1').setAttribute('xlink:href','#opBtn_preorder');
		svgDoc.getElementById('opb2').setAttribute('xlink:href','#opBtn_postorder');
		svgDoc.getElementById('opb3').setAttribute('xlink:href','#opBtn_insert')
		svgDoc.getElementById('opb4').setAttribute('xlink:href','#opBtn_delete');
		svgDoc.getElementById('opb5').setAttribute('xlink:href','#opBtn_search');
		opArray=['#opBtn_inorder','#opBtn_preorder','#opBtn_postorder','#opBtn_insert','#opBtn_delete','#opBtn_search']
		
	}
	else if (id=='dsb1'){  //graph

		svgDoc.getElementById('opb0').setAttribute('xlink:href', '#opBtn_dfs_active');
		svgDoc.getElementById('opb1').setAttribute('xlink:href','#opBtn_bfs');
		opArray=['#opBtn_dfs','#opBtn_bfs']
	}
	else if (id=='dsb2'){  //heap
	
		svgDoc.getElementById('opb0').setAttribute('xlink:href','#opBtn_insert_active');
		svgDoc.getElementById('opb1').setAttribute('xlink:href', '#opBtn_remove');
		svgDoc.getElementById('opb2').setAttribute('xlink:href','#opBtn_sort');
		opArray=['#opBtn_insert','#opBtn_remove','#opBtn_sort']

	}
	else{
		alert('Error loading operations');
	}
	
	opSelection=opArray[0].split('_')[1];
}
function createDataStructure(ds, di, change_attr){
					//first cleanup current data structure objects
	switch (ds) {
		case 'bst':
				if (change_attr == 'DS') { // ds selector change
					current_ds = ds;
					cleanupBST(change_attr);
				}
				else if (change_attr == 'DI') {	// data input change
					cleanupBST(change_attr);
					current_di = di;
				}
				break;
		case 'graph':
				break;
		case 'heap':
				break;
	}

					// switch data structures
	switch (ds) {
		case 'bst':
				buildBST(di);
				break;
		case 'graph':
				break;
		case 'heap':
				break;
		default:
				alert('Unknown data structure!');
				break;
	}
}
function createCodeView(ds, op){
					//first cleanup current code view objects
	switch (current_ds) {
		case 'bst':
				cleanupBST('OP');
				break;
		case 'graph':
				break;
		case 'heap':
				break;
	}
					// build code view for new operation/algorithm
	switch (ds) {
		case 'bst':
				buildCodeViewBST(op);
				break;
		case 'graph':
				break;
		case 'heap':
				break;
		default:
				alert('Unknown data structure!');
				break;
	}
}
function buttonHandler(evt) {

	var play=svgDoc.getElementById("playBtn");
	var step=svgDoc.getElementById("stepBtn");
	var run=svgDoc.getElementById("runBtn");
	var reset=svgDoc.getElementById("resetBtn");

	id=evt.target.getAttribute('id');
	if (id=='playBtn' && playActive) {
		play.setAttribute("opacity","1.0");
//		step.setAttribute("opacity","0.5");
		run.setAttribute("opacity","0.5");
		reset.setAttribute("opacity","1.0");

		resetActive=1;
		if (stepActive) 
			processStep();
	}
	else if(id=='stepBtn' && stepActive){
		play.setAttribute("opacity","1.0");
		run.setAttribute("opacity","0.5");
		reset.setAttribute("opacity","1.0");
		resetActive=1;
		runActive = 0;
							// initialize run mode
		stepInit()
		playActive=1;
	}
	else if(id =='runBtn' && runActive){
		play.setAttribute("opacity","1.0");
		step.setAttribute("opacity","0.5");
		run.setAttribute("opacity","1.0");
		reset.setAttribute("opacity","1.0");
		stepActive=0;
		resetActive=1;
							// initialize run mode
		runInit();
		playActive=1;
		runActive=0;
	}
	else if(id=='resetBtn' && resetActive){
		play.setAttribute("opacity","0.5");
		step.setAttribute("opacity","1.0");
		run.setAttribute("opacity","1.0");
		reset.setAttribute("opacity","0.5");
		resetProc();
		playActive=0;
		stepActive=1;
		runActive=1;
		resetActive=0;
	}
	else if (id == 'testBtn')
		processTest()
}

function stepInit() {
	switch (dsSelection) {
		case 'bst':
			stepInitBST(opSelection);
			break;
		case 'default':
			alert (dsSelection + ' not implemented.');
			return;
	}
}
function runInit() {
	switch (dsSelection) {
		case 'bst':
			runInitBST(opSelection);
			break;
		case 'default':
			alert (opSelection + ' not implemented.');
			return;
	}
}
				//// temporary for testing
var click = 0, anim0, circ1;
function processTest() {
	if (click == 0) {
		rect = svgDoc.createElementNS(svgNS, 'rect');
			rect.setAttribute("id", "rect1"); 
			rect.setAttribute("fill","red");
			rect.setAttribute("opacity","0.5");
			rect.setAttribute("stroke","green");
			rect.setAttribute("stroke-width","5");
			rect.setAttribute("x", 50);
			rect.setAttribute("y", 400);
			rect.setAttribute("width", 40);
			rect.setAttribute("height", 20);

		anim0 = svgDoc.createElementNS(svgNS, 'animateMotion');
			anim0.setAttribute("id", 'anim0');
			anim0.setAttribute("path", "M0,0");
			anim0.setAttribute("dur", "0.5s");
			anim0.setAttribute("fill", "freeze");
			anim0.setAttribute("begin", "testBtn.click");


		rect.appendChild(anim0);
		cv_grp.appendChild(rect);
		click++;
	}
	else if (click == 1){
//		circ1.appendChild(anim0);
//		obj.appendChild(anim0);
		anim0.setAttribute('path', 'M0,0 L0,200');
//		var obj = svgDoc.getElementById('anim0');
//		obj.setAttribute('path', 'M0,0 L0,200');
//alert('obj:' + obj);
//		click++;
	}
	else{}
}
				//// temporary for testing
