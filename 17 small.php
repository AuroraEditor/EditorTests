<?php
// This is a basic PHP File.
// Include BaaS-Server
include 'BaaS-Server.php';

// Initialize BaaS Server
$server = BaaS\Server::shared();

// Set Connection type
$server->setDatabase('MySQL');

// Set server's email address to send emails from
$server->setEmailAddress("no-reply@auroraeditor.com");

// Serve
echo $server->serve();
