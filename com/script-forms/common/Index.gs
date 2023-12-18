<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Form</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 20px;
    }

    form {
      max-width: 300px;
      margin: 0 auto;
    }

    label {
      display: block;
      margin-bottom: 8px;
    }

    input {
      width: 100%;
      padding: 8px;
      margin-bottom: 16px;
      box-sizing: border-box;
    }

    input[type="button"] {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      cursor: pointer;
      border-radius: 4px;
    }

    input[type="button"]:hover {
      background-color: #45a049;
    }

    #output {
      color: red;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <form>
    <label for="user">Username:</label>
    <input type="text" id="user" name="user" required><br>

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required><br>

    <input type="button" value="Accept" onclick="updateToken();">
  </form>

  <div id="output"></div>

  <script>
    function updateToken() {
      function onFailure(error) {
        var div = document.getElementById('output');
        div.innerHTML = "ERROR: " + error.message;
      }
      function closeDialog() {
        google.script.host.close();
      }
      var user = document.getElementById('user').value;
      var password = document.getElementById('password').value;
      google.script.run
        .withSuccessHandler(closeDialog)
        .withFailureHandler(onFailure)
        .withUserObject(this)
        .login(user, password);

    }
  </script>
</body>
</html>
