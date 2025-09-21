# PowerShell script to update .env file with Google Client ID
# Run this script after getting your Google Client ID

param(
    [Parameter(Mandatory=$true)]
    [string]$GoogleClientId
)

$envFile = ".env"
$tempFile = ".env.tmp"

# Read the current .env file
$content = Get-Content $envFile

# Update the Google Client ID
$updatedContent = $content | ForEach-Object {
    if ($_ -match "VITE_GOOGLE_CLIENT_ID=") {
        "VITE_GOOGLE_CLIENT_ID=$GoogleClientId"
    } else {
        $_
    }
}

# Write to temporary file first
$updatedContent | Out-File -FilePath $tempFile -Encoding UTF8

# Replace original file
Move-Item $tempFile $envFile -Force

Write-Host "✅ Updated .env file with Google Client ID: $GoogleClientId" -ForegroundColor Green
Write-Host "🚀 You can now test Google OAuth login!" -ForegroundColor Cyan
