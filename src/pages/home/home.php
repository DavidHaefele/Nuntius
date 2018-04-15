<?php
$mysqli = new mysqli("localhost", "root", "", "test");
$query = "SELECT username FROM user WHERE id = 1";
$dbresult = $mysqli->query($query);
 
while($row = $dbresult->fetch_array(MYSQLI_ASSOC)){
 
    $data[] = array(
        'username' => $row['username']
    );
}
 
if($dbresult){
    $result = "{'success':true, 'data':" . json_encode($data) . "}";             
}
else {
    $result = "{'success':false}";
}
 
echo $result;
?>
