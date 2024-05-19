<?php

namespace app\admin\model\pim;

use think\Model;
use traits\model\SoftDelete;

class Schedule extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'pim_schedule';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'status_text'
    ];
    

    protected static function init()
    {
        self::afterInsert(function ($row) {
            $pk = $row->getPk();
            $row->getQuery()->where($pk, $row[$pk])->update(['weigh' => $row[$pk]]);
        });
    }

    
    public function getStatusList()
    {
        return ['0' => __('Status 0'), '1' => __('Status 1'), '2' => __('Status 2')];
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    public function setDeadLineAttr($value)
    {

        if ($value == '' || !isset($value)){
            // 如果画面截止时间为空，则插入null
            return null;
        }else{
            // 如果不为空，原值返回
            return $value;
        }

    }




}
