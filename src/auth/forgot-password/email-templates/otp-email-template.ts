export const otpEmailTemplate = (otp: string, email: string) => `
<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<title>OTP Reset Password Verification</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
    margin: 0;
  }
  .container {
    max-width: 600px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: auto;
  }
  .header {
    text-align: center;
    padding-bottom: 20px;
  }
  .otp {
    text-align: center;
    font-size: 20px;
    color: #333333;
    background-color: #eeeeee;
    padding: 10px;
    border-radius: 4px;
    margin: 20px auto;
  }
  .footer {
    text-align: center;
    padding-top: 20px;
    font-size: 14px;
    color: #777777;
  }
</style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table class="container" cellpadding="0" cellspacing="0">
          <tr>
            <td class="header">
              <h2>Digitefa OTP Verification</h2>
            </td>
          </tr>
          <tr>
            <td>
              <p>Hi ${email},</p>
              <p>You are receiving this email because you requested to reset your password.</p>
              <p>Please use the following code to reset your password.</p>
              <p>Your OTP code is:</p>
              <div class="otp"><strong>${otp}</strong></div>
              <p>This code is valid for 15 minutes only. Please do not share this code with anyone.</p>
              <p>If you did not request this verification, please ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>Thank you, <br> The Digitefa Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
