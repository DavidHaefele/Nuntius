<?php
require 'config.php';
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->post('/login','login');
$app->post('/signup','signup');
$app->post('/getFriends','getFriends');
$app->post('/getAvailableContacts','getAvailableContacts');
$app->post('/addContactAsFriend','addContactAsFriend');
$app->post('/sendMessage','sendMessage');
$app->post('/displayMessages','displayMessages');
$app->post('/deleteConv','deleteConv');
$app->post('/lastMsg','lastMsg');
$app->post('/deltaMsg','deltaMsg');
$app->post('/getID','getID');
$app->post('/getName','getName');
//$app->post('/getFriend','getFriend');
$app->post('/createGroup','createGroup');
$app->post('/getGroups','getGroups');
$app->post('/isAdmin','isAdmin');

$app->run();

//UP TO DATE
//login a user with valid data
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

//Up TO DATE
//get all contacts of the current user
function getFriends() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {
		//Get all the conversations, where the user ID is present
        $db = getDB();
        $userIDs ='';
        $ownID=$data->user_id;
        $sql = "SELECT identifier FROM total_message WHERE identifier LIKE '%".$ownID."%' OR '%".$ownID."%'";
        $stmt = $db->prepare($sql);
        $stmt->execute();
		$mainCount=$stmt->rowCount();
        $userIDs = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $userIDs = $stmt->fetchAll();
        $db = null;
		if($mainCount != 0){
				//get the username for every unknown ID
				$p = 0;
                foreach($userIDs as $row) {
					$conv = $row['identifier'];
					$convArray = explode(':', $conv);
					$doublecheck = false;
					for($i = 0; $i < 2; $i++){
						if($convArray[$i] == $ownID){
							$doublecheck = true;
						}
					}
					if($doublecheck == true)
					{
						for($i = 0; $i < 2; $i++){
							if($convArray[$i] != $ownID){
								$friendID = $convArray[$i];
								$usernameResult = '';
								$db = getDB();
								$userIDs ='';
								$sql = "SELECT username FROM users WHERE user_id = '".$friendID."'";
								$stmt = $db->prepare($sql);
								$stmt->execute();
								$usernameResult = $stmt->fetch(PDO::FETCH_OBJ);
							
								foreach($usernameResult as $friendName){
									//put everything together and send it back to typescript
									if($p == 0){
										$friendlist = '{"friend'.$p.'":{"username":"'.$friendName.'","user_id":"'.$friendID.'"}';
									}else{
										$friendlist = $friendlist.',"friend'.$p.'":{"username":"'.$friendName.'","user_id":"'.$friendID.'"}';
									}
									$p++;
								}
							}
							$db = null;
						}
					}
					$doublecheck = false;
                }
				$friendlist = '{"friendlist":'.$friendlist.'}}';
				echo $friendlist;
				return;
        } else {
            echo '{"error":{"text":"no user data"}}';
		}
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

//UP TO DATE
//get all groups of the current user
function getGroups() {
	$request = \Slim\Slim::getInstance()->request();
	$data = json_decode($request->getBody());
	
	try {
		//Get all groups, where the user ID is present
		$db = getDB();
		$userData ='';
		$ownID=$data->user_id;
		$sql = "SELECT `group_id`,`name` FROM `groups` WHERE members LIKE '%".$ownID."%' OR '%".$ownID."%'";
		$stmt = $db->prepare($sql);
        $stmt->execute();
		$mainCount= $stmt->rowCount();
        $userData = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $userData = $stmt->fetchAll();
		$db = null;
		$grouplist = '';
		if($mainCount != 0){
			$p = 0;
			//put everything together and send it back to typescript
            foreach($userData as $row) {
				if($p == 0){
					$grouplist = '{"group'.$p.'":{"name":"'.$row['name'].'","group_id":"'.$row['group_id'].'"}';
				}else{
					$grouplist = $grouplist.',"group'.$p.'":{"name":"'.$row['name'].'","group_id":"'.$row['group_id'].'"}';
				}
				$p++;
			}
		}else{
			echo '{"error":{"text":"empty response"}}';
			return;
		}
		$grouplist = '{"grouplist":'.$grouplist.'}}';
		echo $grouplist;
		return;
		echo '{"error":{"text":"empty response"}}';
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

//UP TO DATE
//return all available contacts found for the specific input
function getAvailableContacts() {
	$request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    try {
		$db = getDB();
		$userData ='';
		$username=$data->username;
		$sql = "SELECT user_id,username FROM users WHERE username LIKE '%".$username."%'";
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$mainCount= $stmt->rowCount();
		$userData = $stmt->setFetchMode(PDO::FETCH_ASSOC);
		$userData = $stmt->fetchAll();
	    
		$db = null;
		if($mainCount != 0){
			$p = 0;
			foreach($userData as $row) {
				if($p == 0){
					$endresult = '{"contact'.$p.'":{"username":"'.$row["username"].'","user_id":"'.$row["user_id"].'"}';
				}else{
					$endresult = $endresult.',"contact'.$p.'":{"username":"'.$row["username"].'","user_id":"'.$row["user_id"].'"}';
				}
				$p++;
			}
			$endresult = '{"contactlist":'.$endresult.'}}';
			echo $endresult;
			return;
		} else {
			echo '{"error":{"text":"no user data"}}';
			return;
	    }
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

//UP TO DATE
//Check if a user is an admin of a group
function isAdmin(){
	$request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    try {
		$db = getDB();
        $ownID=$data->ownID;
		$groupID = $data->groupID;
		$sql = "SELECT name FROM groups WHERE admins LIKE '%$ownID%' AND group_id = $groupID";
        $stmt = $db->prepare($sql);
        $stmt->execute();
		$mainCount=$stmt->rowCount();
		if($mainCount != 0){
			 echo '{"returnValue": true}';
			 return;
		}else{
			echo '{"returnValue": false}';
			return;
		}
	}
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

//OUT DATED
/*
//return a userID to a username
function getFriend() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    try {
		$db = getDB();
		$userData ='';
		$username=$data->username;
		$sql = "SELECT user_id,username FROM users WHERE username LIKE '%".$username."%'";
		$stmt = $db->prepare($sql);
		$stmt->execute();
	    $userData = $stmt->setFetchMode(PDO::FETCH_ASSOC);
	    $userData = $stmt->fetchAll();

		$db = null;
		if($userData){
			$endresult ='';
		    foreach($userData as $row) {
				$endresult = $endresult.$row['username'].':'.$row['user_id'].':';
		    }
		    if(!empty($endresult)){
				$endresult = json_encode($endresult);
		        echo '{"userData": ' . $endresult . '}';
		    }else {
				echo '{"error":{"text":"empty response"}}';
		    }
		} else {
			echo '{"error":{"text":"no user data"}}';
		}
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
*/

//UP TO DATE
//add a found contact as a friend
function addContactAsFriend() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    try {
		$db = getDB();
        $userData = '';
		$conv = $data->conv;
		$sql = "SELECT identifier FROM total_message WHERE identifier=:conv";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("conv", $data->conv,PDO::PARAM_STR);
        $stmt->execute();
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
			$userData = "success";
		}
		$db = null;
		if($userData == "success"){
            echo '{"success": "true"}';
			return;
        } else {
           echo '{"success": "false"}';
		   return;
		}
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

//UP TO DATE
//create a group in the groups table
function createGroup() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());

  try {
  $db = getDB();
  //Inserting group name and members
  $sql1="INSERT INTO groups(name, members,admins,total_messages)VALUES(:name, :members,:admins, 0)";
  $stmt1 = $db->prepare($sql1);
  $stmt1->bindParam("name", $data->name,PDO::PARAM_STR);
  $stmt1->bindParam("members", $data->members,PDO::PARAM_STR);
  $stmt1->bindParam("admins", $data->admin,PDO::PARAM_STR);
  $stmt1->execute();
  $db = null;
  if($db == null){
		echo '{"success": "true"}';
		return;
	} else {
		echo '{"success": "false"}';
		return;
	}
  }catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

//UP TO DATE
//add a message to a conversation
function sendMessage() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    try {
		$db = getDB();
		if($data->groupMessage){
			$sql = "UPDATE groups SET total_messages = total_messages + 1 WHERE group_id = :conv";	
		}else{
			$sql = "UPDATE total_message SET total_messages = total_messages + 1 WHERE identifier = :conv";
		}
		$stmt = $db->prepare($sql);
		$stmt->bindParam("conv", $data->conv,PDO::PARAM_STR);
		$stmt->execute();
		
		if($data->groupMessage){
			$sql1 = "SELECT total_messages FROM groups WHERE group_id = :conv";
		}else{
			$sql1 = "SELECT total_messages FROM total_message WHERE identifier = :conv";
		}
		
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
            echo '{"total": "' .$total . '"}';
        } else {
            echo '{"error":"Error in else"}';
        }
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/*
//UP TO DATE
//Does not seem to be needed
//get the ID to a username
function getID(){
	$request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    try {
		$db = getDB();
        $sql1="SELECT user_id FROM `users` WHERE username='".$data."'";
        $stmt1 = $db->prepare($sql1);
        $stmt1->execute();
		$user_id = $stmt1->fetch(PDO::FETCH_OBJ);
        $db = null;

        if($user_id){
            echo '{"user_id": "' .$user_id . '"}';
			return;
        } else {
            echo '{"error":{"text":"Enter valid data"}}';
			return;
        }
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
*/

/*
//UP TO DATE
//get a name to a username (?same as getFriend?)
function getName(){
	$request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {

            $db = getDB();
            $sql="SELECT username FROM `users` WHERE user_id='".$data."'";
            $stmt = $db->prepare($sql);
            $stmt->execute();
			$username = $stmt->fetch(PDO::FETCH_OBJ);
            $db = null;


            if($username){
                echo '{"username": "' .$username . '"}';
            } else {
               echo '{"error":{"text":"Enter valid data"}}';            
            }

    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
*/

//UP TO DATE
//get all the messages in a conversation
function displayMessages() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
	
    try {
		
			//read all messages between the users or in the group
            $conv = $data->conv;
            $db = getDB();
            $sql = "SELECT identifier_message_number,message,author FROM messages WHERE identifier_message_number LIKE '%".$conv."%' ORDER BY id";
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $result = $stmt->fetchAll();

			if($result){
				//create a JSON string, which stores all messages and their information
				$msg = "";
				$messagelist = '{"messagelist":';
				$messagenumber = 0;
				$maxnumber = sizeof($result);
				foreach($result as $row) {

					$sql2 = "SELECT username FROM users WHERE user_id LIKE '%".$row["author"]."%'";
					$stmt2 = $db->prepare($sql2);
					$stmt2->execute();
					$authorName = $stmt2->setFetchMode(PDO::FETCH_ASSOC);
					$authorName = $stmt2->fetchAll();

					$identifier_message_number = $row['identifier_message_number']; 
					$messageArray = explode(':',$identifier_message_number);
					$messageID = $messageArray[sizeof($messageArray)-1];

					if($messagenumber == 0){
						$msg = '{"message'.$messagenumber.'":{"message":"'.$row['message'].'","author":"'.$authorName[0]["username"].'","authorID":"'.$row["author"].'","id":"'.$messageID.'"}';
					}else{
						$msg = $msg.',"message'.$messagenumber.'":{"message":"'.$row['message'].'","author":"'.$authorName[0]["username"].'","authorID":"'.$row["author"].'","id":"'.$messageID.'"}';
					}
					$messagenumber = $messagenumber+1;
				}
				$messagelist = $messagelist.$msg."}}";
				$db = null;
				echo $messagelist;
			}else{
				echo '{"error":{"text":"No messages"}}';;
				return;
			}
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

//UP TO DATE
//delete a conversation
function deleteConv() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {
            $conv = $data->conv;
			$isGroup = $data->isGroup;
			$user_id = $data->user_id;
			$asAdmin = $data->asAdmin;
            $db = getDB();
			
			//delete the group if admin deletes it
			if($asAdmin == true && $isGroup == true){
				$sql = "DELETE FROM groups WHERE group_id = $conv";
			
			//remove user from group
			}else if($asAdmin == false && $isGroup == true){
				$sql2 = "SELECT members FROM groups WHERE group_id = $conv";
				$stmt2 = $db->prepare($sql2);
				$stmt2->execute();
				$members = $stmt2->setFetchMode(PDO::FETCH_ASSOC);
				$members = $stmt2->fetchAll();
				$finalmembers = "";
				$p = 0;
				foreach($members as $row){
					$membersArray = explode(':',$row['members']);
					foreach($membersArray as $member)
					{
						if($member != $user_id){
							if($p == 0)
							{
								$finalmembers = $member;
								$p++;
							}else{
								$finalmembers = $finalmembers.":".$member;
							}
						}
					}
				}
				$sql = 'UPDATE groups SET members = "5:7" WHERE group_id = "8"';
			//remove conversation between two users
			}else if($isGroup == false){
				$sql = "DELETE FROM messages WHERE identifier_message_number LIKE '%".$conv."%'";
			}
            $stmt = $db->prepare($sql);
            $stmt->execute();
			
			//delete all messages of the conversation
			if($asAdmin == true){
				$sql1 = "DELETE FROM messages WHERE identifier_message_number LIKE '%".$conv."%'";
				$stmt1 = $db->prepare($sql1);
				$stmt1->execute();
			}
            $endresult = $data->conv;

            $db = null;

            if($endresult){
                echo '{"success": "true"}';
            } else {
               echo '{"success": "false"}';
            }

    }
    catch(PDOException $e) {
		echo '{"success": "'. $e->getMessage() .'"}';
    }
}

//UP TO DATE
//get the last message of a conversation
function lastMsg() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {
            $conv = $data->conv;
            $nr = $data->nr;
            $db = getDB();
            $sql = "SELECT message, author FROM messages WHERE id=(SELECT MAX(id) FROM messages WHERE identifier_message_number LIKE '%".$conv."%')";
            $stmt = $db->prepare($sql);
            $stmt->execute();
			$endresult = $stmt->setFetchMode(PDO::FETCH_ASSOC);
			$endresult = $stmt->fetchAll();

            if($endresult){
				foreach($endresult as $row) {
					$db = getDB();
					$sql2 = "SELECT username FROM users WHERE user_id LIKE '%".$row["author"]."%'";
					$stmt2 = $db->prepare($sql2);
					$stmt2->execute();
					$authorName = $stmt2->setFetchMode(PDO::FETCH_ASSOC);
					$authorName = $stmt2->fetchAll();
					if($authorName){
						foreach($authorName as $row2) {
							$jsonString = '{"message":"'.$row["message"].'","author":"'.$row2['username'].'","id":"'.$nr.'"}';
							echo $jsonString;
							return;
						}
					}
				}
            } else {
				$jsonString = '{"message":"","author":"","id":""}';
				echo $jsonString;
				return;
            }
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

//UP TO DATE
//get weather there are new messages or not
function deltaMsg() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    try {
        $change = '0';
        $oldId = $data->oldId;
        $conv = $data->conv;
        $db = getDB();
        $sql = "SELECT total_messages FROM total_message WHERE identifier LIKE '%".$conv."%'";
        $stmt = $db->prepare($sql);
        $stmt->execute();
		$mainCount = $stmt->rowCount();
		$endresult = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $endresult = $stmt->fetchAll();
		$db = null;
		if($mainCount != 0){
			foreach($endresult as $row) {
				if($row['total_messages'] != $oldId)
				{
					$change = 1;
					$change = json_encode($change);
					echo $change;
					return;
				}else{
					$change = 0;
					$change = json_encode($change);
					echo $change;
					return;
				}
			}
		} else {
			echo '{"error":{"text":"Error in else"}}';
        }
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

//UP TO DATE
// User registration
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
            $db = getDB();
            $sql = "SELECT user_id FROM users WHERE username=:username";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("username", $username,PDO::PARAM_STR);
            $stmt->execute();
            $mainCount=$stmt->rowCount();
            $created=time();
            if($mainCount == 0)
            {
				$db = getDB();
                $sql1="INSERT INTO users(username,password)VALUES(:username,:password)";
                $stmt1 = $db->prepare($sql1);
                $stmt1->bindParam("username", $username,PDO::PARAM_STR);
                $password=hash('sha256',$data->password);
                $stmt1->bindParam("password", $password,PDO::PARAM_STR);
				$stmt1->execute();
				
				$db = getDB();
				$sql2 = "SELECT user_id, username FROM users WHERE username=:username";
				$stmt2 = $db->prepare($sql2);
				$stmt2->bindParam("username", $username,PDO::PARAM_STR);
				$stmt2->execute();
				$userData = $stmt2->fetch(PDO::FETCH_OBJ);
				if($userData){
					$userData = json_encode($userData);
                echo '{"userData": ' . $userData . '}';
				} else {
					echo '{"error":{"text":"Bad request wrong username and password"}}';
				}
            }else{
				echo '{"error":{"text":"Enter another name"}}';
			}
            $db = null;

		}
        else{
            echo '{"error":{"text":"Enter valid data"}}';
        }
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/*
//UP TO DATE
// internal Username Details
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
*/
?>