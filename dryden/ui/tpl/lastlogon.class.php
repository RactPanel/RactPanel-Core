<?php

/**
 * @copyright 2019-2020 RactPanel Project (http://www.ractpanel.ractbd.com/) 
 * RactPanel is a GPL fork of the Sentora Project whose original header follows:
 *
 * Generic template place holder class.
 * @package zpanelx
 * @subpackage dryden -> ui -> tpl
 * @version 1.0.0
 * @author Bobby Allen (ballen@bobbyallen.me)
 * @copyright ZPanel Project (http://www.zpanelcp.com/)
 * @link http://www.zpanelcp.com/
 * @license GPL (http://www.gnu.org/licenses/gpl.html)
 */
class ui_tpl_lastlogon {

    public static function Template() {
        $currentuser = ctrl_users::GetUserDetail(ctrl_auth::CurrentUserID());
        if ($currentuser['lastlogon']) {
            return date(ctrl_options::GetSystemOption('ractpanel_df'), $currentuser['lastlogon']);
        } else {
            return "<: Never :>";
        }
    }

}

?>