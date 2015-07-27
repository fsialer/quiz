module.exports=function(sequelize,DataTypes){
	return sequelize.define(
		'Comment',
		{
			texto:{
				type:DataTypes.STRING,
				validate:{notEmpty:{msg:"-> Falta Comentario"}}
			},
			publicado:{
				type:DataTypes.BOOLEAN,
				defaultValue:false
			},
		},
		{
        classMethods: {
           //CountunPublished: function(){ return this.aggregate('QuizId', 'count', {'where': { 'publicado': false }}).then('success',function(count) {return count;})}
           CountunPublished: function(){ return this.count('QuizId', {'where': { 'publicado': false }}).then('success',function(count) {return count;})}
         ,
          CountCommentedQuizes: function () { return this.aggregate('QuizId', 'count', {'distinct': true }).then('success',function(count) {return count;})}
       }}
		);

};