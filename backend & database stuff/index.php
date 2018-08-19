<?php
require 'config.php';
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->post('/login','login'); /* User login */
$app->post('/signup','signup'); /* User Signup  */
$app->post('/getContacts','getContacts');
$app->post('/getFriend','getFriend');
$app->post('/addConv','addConv');
$app->post('/sendMessage','sendMessage');
$app->post('/displayMessages','displayMessages');
$app->post('/deleteContact','deleteContact');
$app->post('/lastMsg','lastMsg');
$app->post('/deltaMsg','deltaMsg');

$app->run();

/************************* USER LOGIN *************************************/
/* ### User login ### */
function login() {

    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {

        $db = getDB();
        $userData ='';
        $sql = "SELECT user_id, username FROM users WHERE (username=:username) and password=:password ";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("username", $data->username, PDO::PARAM_STR);
        $password=hash('sha256',$data->password);
        $stmt->bindParam("password", $password, PDO::PARAM_STR);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $userData = $stmt->fetch(PDO::FETCH_OBJ);

        if(!empty($userData))
        {
            $user_id=$userData->user_id;
            $userData->token = apiToken($user_id);
        }

        $db = null;
         if($userData){
               $userData = json_encode($userData);
                echo '{"userData": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Bad request wrong username and password"}}';
            }


    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getContacts() {
        $request = \Slim\Slim::getInstance()->request();
        $data = json_decode($request->getBody());


        try {

        $db = getDB();
        $userData ='';
        $username=$data->username;
        $sql = "SELECT identifier FROM total_message WHERE identifier LIKE '%".$username."%'";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $userData = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $userData = $stmt->fetchAll();

        if(!empty($userData))
        {

        }

        $db = null;
         if($userData){
                $endresult ='';
                foreach($userData as $row) {
                        $endresult = $endresult.$row['identifier'].':';
                }
                if(!empty($endresult)){
                        $endresult = json_encode($endresult);
                        echo '{"userData": ' . $endresult . '}';
                }

                else {
                        echo '{"error":{"text":"empty "}}';
                }

            } else {
               echo '{"error":{"text":"no user data"}}';
            }

    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


function getFriend() {
                $request = \Slim\Slim::getInstance()->request();
        $data = json_decode($request->getBody());


        try {

        $db = getDB();
        $userData ='';
                $username=$data->username;
        $sql = "SELECT username FROM users WHERE username LIKE '%".$username."%'";
        $stmt = $db->prepare($sql);
        $stmt->execute();
                $userData = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $userData = $stmt->fetchAll();

        if(!empty($userData))
        {

        }

                        $db = null;
         if($userData){
                        $endresult ='';
                foreach($userData as $row) {
                        $endresult = $endresult.$row['username'].':';
                }
                if(!empty($endresult)){
                        $endresult = json_encode($endresult);
                        echo '{"userData": ' . $endresult . '}';
                }

                else {
                        echo '{"error":{"text":"empty response"}}';
                }

            } else {
               echo '{"error":{"text":"no user data"}}';
            }

    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function addConv() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {

            $db = getDB();
            $userData = 'test';
            $sql = "SELECT identifier FROM total_message WHERE identifier=:conv";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("conv", $data->conv,PDO::PARAM_STR);
            $stmt->execute();
            $mainCount=$stmt->rowCount();
            $created=time();
            if($mainCount==0)
            {

                /*Inserting conversation*/
                $sql1="INSERT INTO total_message(identifier, total_messages)VALUES(:conv,0)";
                $stmt1 = $db->prepare($sql1);
                $stmt1->bindParam("conv", $data->conv,PDO::PARAM_STR);
                $stmt1->execute();

            }

            $db = null;


            if($userData){
               $userData = json_encode($userData);
                echo '{"userDataC": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Enter valid data"}}';            }

    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function sendMessage() {
        $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {

            $db = getDB();
            $sql = "UPDATE total_message SET total_messages = total_messages + 1 WHERE identifier = :conv";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("conv", $data->conv,PDO::PARAM_STR);
            $stmt->execute();

            $sql1 = "SELECT total_messages FROM total_message WHERE identifier = :conv";
            $stmt1 = $db->prepare($sql1);
            $stmt1->bindParam("conv", $data->conv,PDO::PARAM_STR);
            $stmt1->execute();
            $result = $stmt1->setFetchMode(PDO::FETCH_ASSOC);
                        $result = $stmt1->fetchAll();

            foreach($result as $row) {
                        $total = $total.$row['total_messages'];
                        }


            $conv = $data->conv . ":" . $total;

            $sql2="INSERT INTO messages(identifier_message_number, message, author) VALUES ('".$conv."', :message, :author)";
            $stmt2 = $db->prepare($sql2);
            $stmt2->bindParam("message", $data->message,PDO::PARAM_STR);
            $stmt2->bindParam("author", $data->author,PDO::PARAM_STR);
            $stmt2->execute();

            $db = null;

            if($total){
               $total = json_encode($total);
                echo '{"total": ' .$total . '}';
            } else {
               echo '{"error":{"text":"Error in else"}}';
            }

    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


function displayMessages() {
        $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {

            $conv = $data->conv;
            $db = getDB();
            $sql = "SELECT message,author FROM messages WHERE identifier_message_number LIKE '%".$conv."%' ORDER BY id";
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $result = $stmt->fetchAll();

            $sql1 = "SELECT MAX(id) FROM messages WHERE identifier_message_number LIKE '%".$conv."%'";
            $stmt1 = $db->prepare($sql1);
            $stmt1->execute();
            $endresult1 = $stmt1->fetch(PDO::FETCH_OBJ);

            $endresult = "";
            foreach($result as $row) {
                        $endresult = $endresult.$row['message']."fส้้้้´".$row['author']."fส้้้้´";
                        }

            $db = null;

            if($endresult){
               $endresult = json_encode($endresult);
               $endresult1 = json_encode($endresult1);
                echo '{"disMes": ' .$endresult . ', "oldId": ' . $endresult1 . '}';
            } else {
               echo '{"error":{"text":"Error in else"}}';
            }

    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


function deleteContact() {
        $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {
                        $conv = $data->conv;
            $db = getDB();
            $sql = "DELETE FROM messages WHERE identifier_message_number LIKE '%".$conv."%'";
            $stmt = $db->prepare($sql);
            $stmt->execute();

                        $sql1 = "DELETE FROM total_message WHERE identifier LIKE '%".$conv."%'";
                        $stmt1 = $db->prepare($sql1);
                        $stmt1->execute();

            $endresult = $data->conv;

            $db = null;

            if($endresult){
               $endresult = json_encode($endresult);
                echo '{"disMes": ' .$endresult . '}';
            } else {
               echo '{"error":{"text":"Error in else"}}';
            }

    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


function lastMsg() {
        $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {
                        $conv = $data->conv;
                        $nr = $data->nr;
            $db = getDB();
            $sql = "SELECT message FROM messages WHERE id=(SELECT MAX(id) FROM messages WHERE identifier_message_number LIKE '%".$conv."%')";
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $endresult = $stmt->fetch(PDO::FETCH_OBJ);

            $db = null;

            if($endresult){
               $endresult = json_encode($endresult);
                echo '{"disMes": ' .$endresult . ', "nr": ' .$nr.'}';
            } else {
                $endresult = json_encode("");
                echo '{"disMes": ' .$endresult . ', "nr": ' .$nr.'}';
            }

    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


function deltaMsg() {
        $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {
                        $change = '0';
                        $oldId = $data->oldId;
                        $conv = $data->conv;
            $db = getDB();
            $sql = "SELECT MAX(id) FROM messages WHERE identifier_message_number LIKE '%".$conv."%'";
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $endresult = $stmt->fetch(PDO::FETCH_OBJ);

            $db = null;

            if($endresult){
                                $endresult= json_encode($endresult);
                                if($endresult != $oldId) {
                                        $change = '1';
                                        $change = json_encode($change);
                                        echo '{"change": ' .$change . '}';
                                }

                                else {
                                        $change = json_encode($change);
                                        echo '{"change": ' .$change . '}';
                                }
            } else {
               echo '{"error":{"text":"Error in else"}}';
            }

    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}



/* ### User registration ### */
function signup() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $username=$data->username;
    $password=$data->password;

    try {

        $username_check = preg_match('~^[A-Za-z0-9_]{3,20}$~i', $username);
        $password_check = preg_match('~^[A-Za-z0-9!@#$%^&*()_]{6,20}$~i', $password);

        if (strlen(trim($username))>0 && strlen(trim($password))>0 && $username_check>0 && $password_check>0)
        {
            echo 'here';
            $db = getDB();
            $userData = '';
            $sql = "SELECT user_id FROM users WHERE username=:username";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("username", $username,PDO::PARAM_STR);
            $stmt->execute();
            $mainCount=$stmt->rowCount();
            $created=time();
            if($mainCount==0)
            {

                /*Inserting user values*/
                $sql1="INSERT INTO users(username,password)VALUES(:username,:password)";
                $stmt1 = $db->prepare($sql1);
                $stmt1->bindParam("username", $username,PDO::PARAM_STR);
                $password=hash('sha256',$data->password);
                $stmt1->bindParam("password", $password,PDO::PARAM_STR);
                $stmt1->execute();

            }

            $db = null;


            if($userData){
               $userData = json_encode($userData);
                echo '{"userData": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Enter valid data"}}';            }


        }
        else{
            echo '{"error":{"text":"Enter valid data"}}';
        }
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


/* ### internal Username Details ### */
function internalUserDetails($input) {

    try {
        $db = getDB();
        $sql = "SELECT user_id, username FROM users WHERE username=:input";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("input", $input,PDO::PARAM_STR);
        $stmt->execute();
        $usernameDetails = $stmt->fetch(PDO::FETCH_OBJ);
        $usernameDetails->token = apiToken($usernameDetails->user_id);
        $db = null;
        return $usernameDetails;

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

?>
