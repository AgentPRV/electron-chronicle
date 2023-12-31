function fetchNotesData(){
  const notesData = window.electronAPI.readNotes();
}

window.electronAPI.renderNotesUI((rows) => {
  rows.forEach(row => {
    panelDiv = returnPanelHTML(row.id, row.title, row.description);
    $("#accordion").append(panelDiv);
  });
})

function returnPanelHTML(id, title, description){
    panel = `<div class="panel panel-default" id="panel`+id+`">
    <div class="panel-heading">
      <span class="panel-title">
        <a data-toggle="collapse" data-parent="#accordion" href="#description`+id+`" id="title`+id+`">`+title+`</a>
      </span>
      <a href="javascript:deleteNote(`+id+`)"><button type="button" class="btn btn-danger act-btns"><i class="fa fa-trash" aria-hidden="true"></i></button></a>

      <button type="button" class="btn btn-info act-btns" onclick="showModal(`+id+`)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>

    </div>
    <div id="description`+id+`" class="panel-collapse collapse">
      <div class="panel-body">`+description+`</div>
    </div>
  </div>`;
  return panel;
}

function deleteNote(id){
    window.electronAPI.deleteNote(id)
    $("#panel"+id).remove();
}

function submitNote(){
    id = $("#note_id").val();
    title = $("#title").val();
    description = $("#description").val();
    if(id==""){
      window.electronAPI.insertNote(title, description)
    }else{
      window.electronAPI.updateNote(id, title, description)
    }
}

