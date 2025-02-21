//Global variables
var userType = "freeform";

var selectedVertex = null;
var space = 4;
let selectedEdge = null;

var vertexRadius = 15;

let graph = new Graph(); //array of vertex objects, each having an array of adjacent vertices

let clickedVertexIndex = -1;

//Question Setup
let questionType;
// let questionCode;
let questionTitle = null;
let questionLoaded = false;

//Weighted
let weight = 0;
let weighted = false;

//Directed
let directed = false;

//Colored
let color = 0;
let colored = false;

//HTML DOM elements
// const body = document.getElementById("body");
const body = document.getElementById("body");

const freeformDiv = document.getElementById("freeformDiv");

const canvasDiv = document.getElementById("canvasDiv");

const vertexDiv = document.getElementById("vertexDiv");
const questionSetupDiv = document.getElementById("questionSetupDiv");

const questionTitleInput = document.getElementById("questionTitle");
const questionTitleLabel = document.getElementById("questionTitleLabel");
const questionTypeDD = document.getElementById("questionTypeDD");
const questionTypeDDLabel = document.getElementById("questionTypeDDLabel");
const directedCB = document.getElementById("directedCB");
const directedCBLabel = document.getElementById("directedCBLabel");
const weightedCB = document.getElementById("weightedCB");
const weightedCBLabel = document.getElementById("weightedCBLabel");
const questionUseRG = document.getElementById("questionUseRG");
const setQuestionButton = document.getElementById("setQuestionButton");

// addVertexDiv
const addVertexDiv = document.getElementById("addVertexDiv");
const addVertexDivHeading = document.getElementById("addVertexDivHeading");
const vertexValue = document.getElementById("vertexValue");
const vertexValueLabel = document.getElementById("vertexValueLabel");
const vertexColor = document.getElementById("vertexColor");
const vertexColorLabel = document.getElementById("vertexColorLabel");
const addVertexButton = document.getElementById("addVertexButton");

// editVertexDiv
const editVertexDiv = document.getElementById("editVertexDiv");
const editVertexDivHeading = document.getElementById("editVertexDivHeading");
const editVertexDD = document.getElementById("editVertexDD");
const editVertexValueLabel = document.getElementById("editVertexValueLabel");
const editVertexValue = document.getElementById("editVertexValue");
const editVertexColorLabel = document.getElementById("editVertexColorLabel");
const editVertexColor = document.getElementById("editVertexColor");
const updateVertexButton = document.getElementById("updateVertexButton");

const rootDiv = document.getElementById("rootDiv");
const deleteVertexDiv = document.getElementById("deleteVertexDiv");

const edgeDiv = document.getElementById("edgeDiv");

// addEdgeDiv
const addEdgeDiv = document.getElementById("addEdgeDiv");
const addEdgeDivHeading = document.getElementById("addEdgeDivHeading");
const vertex1DDLabel = document.getElementById("vertex1DDLabel");
const vertex1DD = document.getElementById("vertex1DD");
const vertex2DDLabel = document.getElementById("vertex2DDLabel");
const vertex2DD = document.getElementById("vertex2DD");
const edgeWeightLabel = document.getElementById("edgeWeightLabel");
const edgeWeight = document.getElementById("edgeWeight");
const addEdgeButton = document.getElementById("addEdgeButton");

const updateEdgeDiv = document.getElementById("updateEdgeDiv");
const deleteEdgeDiv = document.getElementById("deleteEdgeDiv");

const downloadButton = document.getElementById("downloadButton");
const link = document.getElementById("link");

//Bindings and event handlers
function addBindings() {
  //Question setup
  document.getElementById("coloredCB").onchange = doColored;
  document.getElementById("directedCB").onchange = doDirected;
  document.getElementById("weightedCB").onchange = doWeighted;
  document.getElementById("confirmButton").onclick = doConfirm;

  //Vertices
  document.getElementById("addVertexButton").onclick = doAddVertex;
  document.getElementById("editVertexDD").onchange = editVertexSelected;
  document.getElementById("updateVertexButton").onclick = doUpdateVertex;
  document.getElementById("deleteVertexButton").onclick = doDeleteVertex;
  document.getElementById("setRootButton").onclick = setRoot;
  document.getElementById("clearRootButton").onclick = clearRoot;


  //Edges
  document.getElementById("addEdgeButton").onclick = doAddEdge;
  document.getElementById("updateEdgeDD").onchange = editEdgeSelected;
  document.getElementById("updateEdgeButton").onclick = doUpdateEdge;
  document.getElementById("deleteEdgeButton").onclick = doDeleteEdge;

  //Interface
  document.getElementById("downloadButton").onclick = doDownload;
  window.addEventListener('keydown', handleKeyDown, false);

  setupInterface();
}

//Question setup
function doColored() {
  let coloredCB = document.getElementById('coloredCB');

  if (coloredCB.checked) {
    colored = true;
  } else if (!coloredCB.checked) {
    colored = false;
  }

  setupInterface();
}

function doDirected() {
  let directedCB = document.getElementById('directedCB');

  if (directedCB.checked) {
    directed = true;
  } else if (!directedCB.checked) {
    directed = false;
  }

  setupInterface();
}

function doWeighted() {
  let weightedCB = document.getElementById('weightedCB');

  if (weightedCB.checked) {
    weighted = true;
  } else if (!weightedCB.checked) {
    weighted = false;
  }

  setupInterface();
}

function doConfirm() {
  let qTitle = document.getElementById("questionTitle");

  if (qTitle.value.length != 0) {

    setupInterface();

    questionTitle = qTitle.value;

    alert("Question setup completed");

  } else {
    alert("Please enter a title");
  }
}

//Vertices
function doAddVertex() {
  let valueText = document.getElementById("vertexValue");
  let colorText = document.getElementById("vertexColor");

  let value;

  // TODO support comma-separated list of vertices
  let values = [];
  let colors = [];

  if (valueText.value.includes(",")) {        // add single vertex
    values = valueText.value.split(",");

    if (colored && colorText.value.length != 0) {      // check if color field is empty
      if (colorText.value.includes(",")) {        // check if list
        colors = colorText.value.split(",");
      }
    }

    for (var i = 0; i < values.length; i++) {
      value = values[i];
      if (colors.length != 0 && (i < colors.length || i == 0)) {
        color = parseInt(colors[i]);
      } else {
        color = 0;
      }
      let x = Math.random() * 450 + 50;
      let y = Math.random() * 350 + 50;
      graph.addVertex(value, x, y, color);

      populateDropDowns();
      redraw();
    }
  } else { // add single vertex
    let x = Math.random() * 450 + 50;
    let y = Math.random() * 350 + 50;
    if (valueText.value.length != 0) {
      value = valueText.value;
    } else {
      value = graph.getNumberVertices();
    }

    if (colored) {
      if (colorText.value.length != 0) {
        color = parseInt(colorText.value);
      } else {
        color = 0;
      }

      graph.addVertex(value, x, y, color);

      populateDropDowns();
      redraw();
    } else {
      graph.addVertex(value, x, y, color);

      populateDropDowns();
      redraw();
    }
  }
}

function editVertexSelected() {
  let dropDown = document.getElementById("editVertexDD");
  let vertexID = dropDown.options[dropDown.selectedIndex].value;

  document.getElementById("editVertexValue").value = graph.getVertex(vertexID).getVertexVal();
  document.getElementById("editVertexColor").value = graph.getVertex(vertexID).getColor();
}

function doUpdateVertex() {
  let dropDown = document.getElementById("editVertexDD");

  let newValue = document.getElementById("editVertexValue").value;

  if (colored) {
    let newColor = document.getElementById("editVertexColor").value;
  }
  if (dropDown.selectedIndex != 0) {
    let vertexID = dropDown.options[dropDown.selectedIndex].value;

    graph.updateVertexVal(vertexID, newValue);

    if (colored) {
      graph.updateVertexColor(vertexID, newColor);

    }
    populateDropDowns();
    redraw();
  } else {
    if (clickedVertexIndex != -1) {
      graph.getVertex(clickedVertexIndex).setVertexVal(newValue);
      if (colored) {
        graph.getVertex(clickedVertexIndex).setColor(newColor);
      }
      populateDropDowns();
      redraw();

    } else {
      alert("Please select a vertex to edit");
    }
  }
}

function doDeleteVertex() {
  let dropDown = document.getElementById("deleteVertexDD");

  if (dropDown.selectedIndex != 0) {
    let vertexID = dropDown.options[dropDown.selectedIndex].value;
    graph.removeVertex(vertexID);

    populateDropDowns();
    redraw();
  } else {
    alert("Please select a vertex to delete");
  }
}

function setRoot() {
  let dropDown = document.getElementById("setRootDD");

  if (dropDown.selectedIndex != 0) {
    let vertexID = parseInt(dropDown.options[dropDown.selectedIndex].value);
    graph.setSourceNode(vertexID);

    populateDropDowns();
    redraw();
  } else {
    alert("Please select a vertex to set as the root");
  }
}

function clearRoot() {
    graph.setSourceNode(-1);

    populateDropDowns();
    redraw();
}

//Edges
function findEdgeIndex(edgesArray, first, second) {
  for (let i = 0; i < edgesArray.length; ++i) {
    if ((edgesArray[i].getVertexOne().getVertexID() == first && edgesArray[i].getVertexTwo().getVertexID() == second) || (edgesArray[i].getVertexOne().getVertexID() == second && edgesArray[i].getVertexTwo().getVertexID() == first)) {
      return i;
    }
  }
}

function doAddEdge() {
  let firstDropDown = document.getElementById("vertex1DD");
  let secondDropDown = document.getElementById("vertex2DD");

  let firstID = firstDropDown.options[firstDropDown.selectedIndex].value;
  let secondID = secondDropDown.options[secondDropDown.selectedIndex].value;

  let edgeWeight = document.getElementById("edgeWeight");

  function checkExists(first, second) {
    for (let i = 0; i < graph.edges.length; ++i) {
      if ((graph.edges[i].getVertexOne().getVertexID() == first && graph.edges[i].getVertexTwo().getVertexID() == second) || (graph.edges[i].getVertexOne().getVertexID() == second && graph.edges[i].getVertexTwo().getVertexID() == first)) {
        return true;
      }
    }
  }

  if (!checkExists(firstID, secondID)) {
    if (firstDropDown.selectedIndex != secondDropDown.selectedIndex) {
      if (firstDropDown.selectedIndex != 0) {
        if (secondDropDown.selectedIndex != 0) {
          weight = 1;
          if (weighted) {
            if (edgeWeight.value.length != 0) {

              weight = parseInt(edgeWeight.value);
              if (directed) {
                graph.addDirectedEdge(firstID, secondID, weight);
              } else {
                graph.addEdge(firstID, secondID, weight);
              }

              populateDropDowns();
              redraw();
            } else {
              alert("Please enter a weight for the edge")
            }
          } else {
            if (directed) {
              graph.addDirectedEdge(firstID, secondID, weight);
            } else {
              graph.addEdge(firstID, secondID, weight);
            }
            populateDropDowns();
            redraw();
          }
        } else {
          alert("Please select the second vertex");
        }
      } else {
        alert("Please select the first vertex");
      }
    } else {
      alert("Please select different vertices");
    }
  } else {
    alert("This edge already exists");
  }
}

function editEdgeSelected() {
  let dropDown = document.getElementById("updateEdgeDD");

  let weight;

  console.log(graph.directedEdges[dropDown.selectedIndex - 1]);
  console.log(graph.edges[dropDown.selectedIndex - 1]);

  if (directed) {
    weight = graph.directedEdges[dropDown.selectedIndex - 1].getWeightEdge();
  } else if (!directed) {
    weight = graph.edges[dropDown.selectedIndex - 1].getWeightEdge();
  }

  document.getElementById("editWeight").value = weight;
}

function doUpdateEdge() {
  let dropDown = document.getElementById("updateEdgeDD");

  let newWeight = document.getElementById("editWeight").value;

  if (dropDown.selectedIndex != 0) {
    if (directed) {
      graph.directedEdges[dropDown.selectedIndex - 1].setWeightEdge(newWeight);
    } else if (!directed) {
      graph.edges[dropDown.selectedIndex - 1].setWeightEdge(newWeight);
    }
    populateDropDowns();
    redraw();
  } else {
    alert("Please select an edge to edit");
  }
}

function doDeleteEdge() {
  let dropDown = document.getElementById("deleteEdgeDD");

  if (dropDown.selectedIndex != 0) {

    let selected = dropDown.options[dropDown.selectedIndex].textContent;

    let splitted = selected.split(" ");

    let vertex1ID = parseInt(splitted[1]);
    let vertex2ID = parseInt(splitted[6]);

    if (directed) {
      if (selectedEdge != null) {
        graph.removeDirectedEdge(selectedEdge.getVertexOne().getVertexID(), selectedEdge.getVertexTwo().getVertexID());
      } else {
        graph.removeEdge(vertex1ID, vertex2ID);
      }
    } else {
      if (selectedEdge != null) {
        graph.removeEdge(selectedEdge.getVertexOne().getVertexID(), selectedEdge.getVertexTwo().getVertexID());
      } else {
        graph.removeEdge(vertex1ID, vertex2ID);
      }
    }
    populateDropDowns();
    redraw();
  } else {
    alert("Please select an edge to delete");
  }
}

//Interface
function redraw() {
  graphics.fillStyle = "white";
  graphics.fillRect(0, 0, canvas.width, canvas.height);
  drawEdges();
  drawVertices();
}

function clearDropDown(DDB) {
  while (DDB.options.length > 1) {
    DDB.remove(1);
  }
}

function populateDropDowns() {
  var deleteVertexDD = document.getElementById("deleteVertexDD");
  var deleteEdgeDD = document.getElementById("deleteEdgeDD");
  var vertex1DD = document.getElementById("vertex1DD");
  var vertex2DD = document.getElementById("vertex2DD");
  var updateVertexDD = document.getElementById("editVertexDD");
  var editEdgeDD = document.getElementById("updateEdgeDD");
  var setRootDD = document.getElementById("setRootDD");

  if (freeformDiv.contains(updateVertexDD)) {
    clearDropDown(updateVertexDD);
  }
  if (freeformDiv.contains(editEdgeDD)) {
    clearDropDown(editEdgeDD);
  }
  if (freeformDiv.contains(setRootDD)) {
    clearDropDown(setRootDD);
  }

  clearDropDown(vertex1DD);
  clearDropDown(vertex2DD);
  clearDropDown(deleteVertexDD);
  clearDropDown(deleteEdgeDD);

  //Add vertices to delete vertex and add edge drop downs
  function addVertexOption(DDB, value, ID, color) {
    let opt = document.createElement("option");
    opt.textContent = "Vertex " + ID.toString() + ": " + value;
    if (colored) {
      opt.textContent = "Vertex " + ID.toString() + ": " + value + " (Color: " + color.toString() + ")";
    }
    opt.value = ID;
    DDB.options.add(opt);
  }

  for (let i = 0; i < graph.getNumberVertices(); ++i) {
    addVertexOption(vertex1DD, graph.getVertex(i).getVertexVal(), graph.getVertex(i).getVertexID(), graph.getVertex(i).getColor());
    addVertexOption(vertex2DD, graph.getVertex(i).getVertexVal(), graph.getVertex(i).getVertexID(), graph.getVertex(i).getColor());
    addVertexOption(deleteVertexDD, graph.getVertex(i).getVertexVal(), graph.getVertex(i).getVertexID(), graph.getVertex(i).getColor());
    addVertexOption(updateVertexDD, graph.getVertex(i).getVertexVal(), graph.getVertex(i).getVertexID(), graph.getVertex(i).getColor());
    if (freeformDiv.contains(setRootDD)) {
      addVertexOption(setRootDD, graph.getVertex(i).getVertexVal(), graph.getVertex(i).getVertexID(), graph.getVertex(i).getColor());
    }
  }

  //Add edges to delete edge drop downs
  function addEdgeOption(DDB, v1, v2, weight) {
    let opt = document.createElement("option");
    if (weighted) {
      opt.textContent = "Vertex " + v1.getVertexID() + " : " + v1.getVertexVal() + " <---" + weight + "---> " + "Vertex " + v2.getVertexID() + " : " + v2.getVertexVal();
    } else {
      opt.textContent = "Vertex " + v1.getVertexID() + " : " + v1.getVertexVal() + " <-------> " + "Vertex " + v2.getVertexID() + " : " + v2.getVertexVal();
    }
    DDB.options.add(opt);
  }

  function addDirectedEdgeOption(DDB, v1, v2, weight) {
    let opt = document.createElement("option");
    if (weighted) {
      opt.textContent = "Vertex " + v1.getVertexID() + " : " + v1.getVertexVal() + " ||---" + weight + "---> " + "Vertex " + v2.getVertexID() + " : " + v2.getVertexVal();
    } else {
      opt.textContent = "Vertex " + v1.getVertexID() + " : " + v1.getVertexVal() + " ||-------> " + "Vertex " + v2.getVertexID() + " : " + v2.getVertexVal();
    }
    DDB.options.add(opt);
  }

  for (let i = 0; i < graph.edges.length; ++i) {
    addEdgeOption(deleteEdgeDD, graph.edges[i].getVertexOne(), graph.edges[i].getVertexTwo(), graph.edges[i].getWeightEdge());
    if (freeformDiv.contains(editEdgeDD)) {
      addEdgeOption(editEdgeDD, graph.edges[i].getVertexOne(), graph.edges[i].getVertexTwo(), graph.edges[i].getWeightEdge());
    }
  }

  for (let i = 0; i < graph.directedEdges.length; ++i) {
    addDirectedEdgeOption(deleteEdgeDD, graph.directedEdges[i].getVertexOne(), graph.directedEdges[i].getVertexTwo(), graph.directedEdges[i].getWeightEdge());
    if (freeformDiv.contains(editEdgeDD)) {
      addDirectedEdgeOption(editEdgeDD, graph.directedEdges[i].getVertexOne(), graph.directedEdges[i].getVertexTwo(), graph.directedEdges[i].getWeightEdge());
    }
  }
}

function drawVertices() {
  for (let i = 0; i < graph.vertices.length; ++i) {
    graphics.save();
    graph.getVertex(i).drawVertex();
    graphics.restore();
  }
}

function drawEdges() {
  for (let i = 0; i < graph.edges.length; ++i) {
    graphics.save();
    graph.edges[i].drawEdge();
    graphics.restore();
  }


  for (let i = 0; i < graph.directedEdges.length; ++i) {
    graphics.save();
    graph.directedEdges[i].drawEdge();
    graphics.restore();
  }
}

function setupInterface() {

  console.log("Setting up interface")
  //Clear page to add only what is needed

  if (body != null) {
    while (body.firstChild) {
      body.firstChild.remove();
    }
    body.appendChild(freeformDiv);
  }

  if (freeformDiv != null) {
    while (freeformDiv.firstChild) {
      freeformDiv.firstChild.remove();
    }
    freeformDiv.appendChild(canvasDiv);
    freeformDiv.appendChild(vertexDiv);
    freeformDiv.appendChild(edgeDiv);
  }

  //Clear vertex div to add only what is needed
  if (vertexDiv != null) {
    while (vertexDiv.firstChild) {
      vertexDiv.firstChild.remove();
    }
  }

  //Clear edge div to add only what is needed
  if (edgeDiv != null) {
    while (edgeDiv.firstChild) {
      edgeDiv.firstChild.remove();
    }
  }

  //Clear addVertexDiv
  if (addVertexDiv != null) {
    while (addVertexDiv.firstChild) {
      addVertexDiv.firstChild.remove();
    }
  }

  //Clear editVertexDiv
  if (editVertexDiv != null) {
    while (editVertexDiv.firstChild) {
      editVertexDiv.firstChild.remove();
    }
  }

  //Clear addEdgeDiv
  if (addEdgeDiv != null) {
    while (addEdgeDiv.firstChild) {
      addEdgeDiv.firstChild.remove();
    }
  }

  if (colored) { //Only need to change colors - no root/edges

    // directedCB.style.display = "none";
    // directedCBLabel.style.display = "none";
    // weightedCB.style.display = "none";
    // weightedCBLabel.style.display = "none";

    addVertexDiv.appendChild(addVertexDivHeading);
    addVertexDiv.appendChild(vertexValueLabel);
    addVertexDiv.appendChild(vertexValue);
    addVertexDiv.appendChild(document.createElement("br"));
    addVertexDiv.appendChild(vertexColorLabel);
    addVertexDiv.appendChild(vertexColor);
    addVertexDiv.appendChild(addVertexButton);

    editVertexDiv.appendChild(editVertexDivHeading);
    editVertexDiv.appendChild(editVertexDD);
    editVertexDiv.appendChild(document.createElement("br"));
    editVertexDiv.appendChild(editVertexValueLabel);
    editVertexDiv.appendChild(editVertexValue);
    editVertexDiv.appendChild(document.createElement("br"));
    editVertexDiv.appendChild(editVertexColorLabel);
    editVertexDiv.appendChild(editVertexColor);
    editVertexDiv.appendChild(updateVertexButton);

    vertexDiv.appendChild(questionSetupDiv);
    vertexDiv.appendChild(document.createElement("br"));
    vertexDiv.appendChild(addVertexDiv);
    vertexDiv.appendChild(document.createElement("br"));
    vertexDiv.appendChild(editVertexDiv);
    vertexDiv.appendChild(document.createElement("br"));
    vertexDiv.appendChild(deleteVertexDiv);

  } else if (!colored) { //Only need to add/delete edges and change root, no colors

    directedCB.style.display = "initial";
    directedCBLabel.style.display = "initial";
    weightedCB.style.display = "initial";
    weightedCBLabel.style.display = "initial";

    addVertexDiv.appendChild(addVertexDivHeading);
    addVertexDiv.appendChild(vertexValueLabel);
    addVertexDiv.appendChild(vertexValue);
    addVertexDiv.appendChild(document.createElement("br"));
    addVertexDiv.appendChild(addVertexButton);

    editVertexDiv.appendChild(editVertexDivHeading);
    editVertexDiv.appendChild(editVertexDD);
    editVertexDiv.appendChild(document.createElement("br"));
    editVertexDiv.appendChild(editVertexValueLabel);
    editVertexDiv.appendChild(editVertexValue);
    editVertexDiv.appendChild(document.createElement("br"));
    editVertexDiv.appendChild(updateVertexButton);

    vertexDiv.appendChild(questionSetupDiv);
    vertexDiv.appendChild(document.createElement("br"));

    vertexDiv.appendChild(addVertexDiv);
    vertexDiv.appendChild(document.createElement("br"));
    vertexDiv.appendChild(editVertexDiv);
    vertexDiv.appendChild(document.createElement("br"));
    vertexDiv.appendChild(deleteVertexDiv);
  }

  if (weighted) {
    addEdgeDiv.appendChild(addEdgeDivHeading);
    addEdgeDiv.appendChild(vertex1DDLabel);
    addEdgeDiv.appendChild(vertex1DD);
    addEdgeDiv.appendChild(document.createElement("br"));
    addEdgeDiv.appendChild(vertex2DDLabel);
    addEdgeDiv.appendChild(vertex2DD);
    addEdgeDiv.appendChild(document.createElement("br"));
    addEdgeDiv.appendChild(edgeWeightLabel);
    addEdgeDiv.appendChild(edgeWeight);
    addEdgeDiv.appendChild(document.createElement("br"));
    addEdgeDiv.appendChild(addEdgeButton);

    edgeDiv.appendChild(rootDiv);
    edgeDiv.appendChild(document.createElement("br"));
    edgeDiv.appendChild(addEdgeDiv);
    edgeDiv.appendChild(document.createElement("br"));
    edgeDiv.appendChild(updateEdgeDiv);
    edgeDiv.appendChild(document.createElement("br"));
    edgeDiv.appendChild(deleteEdgeDiv);
  } else if (!weighted) {
    addEdgeDiv.appendChild(addEdgeDivHeading);
    addEdgeDiv.appendChild(vertex1DDLabel);
    addEdgeDiv.appendChild(vertex1DD);
    addEdgeDiv.appendChild(document.createElement("br"));
    addEdgeDiv.appendChild(vertex2DDLabel);
    addEdgeDiv.appendChild(vertex2DD);
    addEdgeDiv.appendChild(document.createElement("br"));
    addEdgeDiv.appendChild(addEdgeButton);

    edgeDiv.appendChild(rootDiv);
    edgeDiv.appendChild(document.createElement("br"));
    edgeDiv.appendChild(addEdgeDiv);
    edgeDiv.appendChild(document.createElement("br"));
    edgeDiv.appendChild(deleteEdgeDiv);
  }

  edgeDiv.appendChild(document.createElement("br"));
  edgeDiv.appendChild(document.createElement("br"));
  edgeDiv.appendChild(downloadButton);
  edgeDiv.appendChild(link);
}

//When download is clicked
function doDownload() {
  if (questionTitle != null) {
    try {
      //Save graph as text file
      var stringed = graph.convertGraphToString("freeform", questionType, "freeform");
      var blob = new Blob([stringed], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "Graph_" + questionTitle + ".txt");

      //Save canvas as png
      var link = document.getElementById('link');
      link.setAttribute('download', 'Graph_' + questionTitle + '.png');
      link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
      link.click();

    } catch (err) {
      alert("Error occured while trying to download graph");
    }
  } else {
    alert("Confirm/enter question title.");
  }
}
