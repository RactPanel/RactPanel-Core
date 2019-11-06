<?php
/**
 * @copyright 2019-2020 RactPanel Project (http://www.ractpanel.ractbd.com/) 
 * RactPanel is a GPL fork of the Sentora Project whose original header follows:
 *
 * Hook created by Bobby Allen to obtain latest zpanel version number and add it to the DB for querying (caching bascially!)
 * This script is handy for caching the latest version of ZPanel to reduce bandwidth from the server.
 * 
 */
echo fs_filehandler::NewLine() . "START RactPanel Updates hook" . fs_filehandler::NewLine();
echo "Checking for latest version of RactPanel..." . fs_filehandler::NewLine();
CheckRactPanelLatestVersion();
echo "END RactPanel Updates hook" . fs_filehandler::NewLine();
function CheckRactPanelLatestVersion() {
    // Grab the latest version of RactPanel from the RactPanel API servers and cache it into the database.
    $live_version = ws_generic::ReadURLRequestResult(ctrl_options::GetSystemOption('update_url'));
    if (!$live_version) {
        return false;
    }
        
    $versionnumber = ws_generic::JSONToArray($live_version);
# RactPanel API returns simple object not in an array like it was for zpanel.
#    if(count($versionnumber) > 1) {
#        $currentVersionSetting = current($versionnumber);
#        $currentVersion = $currentVersionSetting['version'];
#    } else {
        $currentVersion = $versionnumber['version'];
#    }
    
    ctrl_options::SetSystemOption('latestzpversion', $currentVersion);
    return true;
}
?>