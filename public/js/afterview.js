document.getElementById('image').onchange=function(e){
  let reader=new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload=function(){
      let preview=document.getElementById('preview');
      preview.src=reader.result;

      preview.append(imagen);
  }
}