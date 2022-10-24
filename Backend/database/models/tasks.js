const {Model} = require('objection');


class Tasks extends Model{
    static get tableName(){
        return 'tasks';
    }
}


module.exports = Tasks;