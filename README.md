# Nuntius
A next generation messenger.

This is a simple account-based messenger hybrid app for Android, IOS and Windows Phone.
Nuntius is built with Ionic 3 and is intended to connect to a MySQL server via a PHP RESTful API on an Apache2 webserver.

<h4>Notes:</h4>
All files and directories exluding <code>backend & database stuff</code> belong to the Ionic application itself whilst <code>backend & database stuff</code> includes the MySQL database structure and the <code>index.php</code> file for your Apache2 webserver. If you want to run your own setup of Nuntius make sure to clone the <code>PHP-Slim-Restful</code> framework from https://github.com/srinivastamada/PHP-Slim-Restful.git into the <code>/var/www/</code> directory of your linux server and replace the <code>index.php</code> file in the <code>PHP-Slim-Restful/api/</code> directory with the equally named PHP file in <code>backend & database stuff</code>. Configure the <code>config.php</code> file in the <code>api/</code> directory which is required by the <code>index.php</code> according to your setup and your needs.

<h3>Remember! Don't consider this being the most secure application on earth and do not use sensible data for testing!</h3>
