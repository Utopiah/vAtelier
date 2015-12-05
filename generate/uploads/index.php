<html>
<body>
<pre>
- received the PDF in a unique folder <?php $id=uniqid(); printf("uniqid(): %s\r\n", $id); ?>
- transform the PDF to textures as images
- generate the VR experience using those textures using a template
<?php 
mkdir("./$id/", 0777);
$target_path = "./$id/";
$target_path = $target_path . basename( $_FILES['uploadedfile']['name']); 
if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
	echo "The file ".  basename( $_FILES['uploadedfile']['name']). 
		" has been uploaded. Next step convert it then display it.";
	$file = basename( $_FILES['uploadedfile']['name']) ;
	mkdir("./$id/textures/", 0777);
	$myconvertcode="convert $id/$file $id/textures/slides.png"; print($myconvertcode);
	passthru("$myconvertcode",$err);
	if (!copy("./template.php","$id/index.php")) {echo "failed to copy the template";}
} else{
	echo "There was an error uploading the file, please try again!";
}
?>

- link to it <a href="./<?php print($id); ?>/">Your presentation as VR</a> then automatically redirect after 5 seconds
</pre>

<script>
    window.setTimeout(function(){
        // Move to a new location or you can do something else
        window.location.href = "<?php print($id); ?>";
    }, 5000);
</script>
</body>
</html>
