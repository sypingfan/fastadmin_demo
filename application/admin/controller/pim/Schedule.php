<?php

namespace app\admin\controller\pim;

use app\common\controller\Backend;

/**
 * 个人日程管理
 *
 * @icon fa fa-circle-o
 */
class Schedule extends Backend
{

    /**
     * Schedule模型对象
     * @var \app\admin\model\pim\Schedule
     */
    protected $model = null;

    /**
     * 数据限制，除了超级管理员外，各用户均只能看到自己的数据
     */
    protected $dataLimit = true;
    protected $dataLimitField = 'admin_id';



    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\pim\Schedule;
        $this->view->assign("statusList", $this->model->getStatusList());
    }



    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */

    /**
     * 开始事务
     */
    public function start($ids = null)
    {
        /* Step.I    从数据库里面取得该条数据 */
        $row = $this->model->get($ids);
        if(!$row){
            $this->error(__("No results were found"));
        }

        /* Step.II   数据操作权限 */
        $adminIds = $this->getDataLimitAdminIds();
        if(is_array($adminIds)){
            if(!in_array($row[$this->dataLimitField],$adminIds)){
                $this->error(__("You have no permission"));
            }
        }

        /* Step.III  更新数据库 */
        if($this->request->isPost()){
            $row->status = 1;
            $row->stime = date("Y-m-d H:i:00",time());
            $row->save();
        }

        /* Step.IV   返回处理结果 */
        $res = array(
            'code' => 1,
            'msg'  =>"事务成功开始",
            'data' => $row,
            'url'  => '.',
            'wait' => 3
        );
        return json($res);
    }

    /**
     * 结束事务
     */
    public function finish($ids = null)
    {
        /* Step.I    从数据库里面取得该条数据 */
        $row = $this->model->get($ids);
        if(!$row){
            $this->error(__("No results were found"));
        }

        /* Step.II   数据操作权限 */
        $adminIds = $this->getDataLimitAdminIds();
        if(is_array($adminIds)){
            if(!in_array($row[$this->dataLimitField],$adminIds)){
                $this->error(__("You have no permission"));
            }
        }

        /* Step.III  更新数据库 */
        if($this->request->isPost()){
            $row->status = 2;
            $row->etime = date("Y-m-d H:i:00",time());
            $row->save();
        }

        /* Step.IV   返回处理结果 */
        $res = array(
            'code' => 1,
            'msg'  =>"事务成功结束",
            'data' => $row,
            'url'  => '.',
            'wait' => 3
        );
        return json($res);
    }

}
