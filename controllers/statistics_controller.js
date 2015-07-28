var models = require('../models/models.js');


  //GET /quizes/statistics
exports.calculate = function(req, res){
    
  var  resultadosEstadisticas = {
    preguntas: 0,
    comentarios: 0,
      media: 0,
    preguntasSC: 0,
    preguntasCC: 0

  };

  models.Quiz.count()
  .then(function(c) 
      {
      resultadosEstadisticas.preguntas = c; 
      //console.log("Hay  " + resultadosEstadisticas.preguntas + " preguntas!!");
      }
      ).then( 
        models.Comment.count()
        .then(function(c) 
            {
            resultadosEstadisticas.comentarios = c;
            //console.log("Hay  " + resultadosEstadisticas.comentarios + " comentarios!!");
            if (resultadosEstadisticas.preguntas > 0)
            { 
              resultadosEstadisticas.media = (resultadosEstadisticas.comentarios / resultadosEstadisticas.preguntas).toFixed(2);
              //console.log("Hay  " + resultadosEstadisticas.media + " comentarios por pregunta!!");
            }           
            }
            ).then( models.Quiz.count({where: [ '"Comments"."QuizId" IS NULL' ],  include: [{ model: models.Comment, required: false}]})
                .then(function(c) 
                  {
                    //console.log("Hay  " + c + " preguntas sin comentarios!!");
                    resultadosEstadisticas.preguntasSC = c;                   
                  }
                   ).then( models.Quiz.count({where: [ '"Comments"."QuizId" IS NOT NULL' ], include: [{ model: models.Comment,required: true}]})
                         .then(function(c) 
                         {
                          //console.log("Hay  " + c + " preguntas con comentarios!!");
                          resultadosEstadisticas.preguntasCC = c;
                          res.render('quizes/statistics',{estadisticas: resultadosEstadisticas, errors:[]});
                         }
                        )
                  )
              )
      ).catch(function(error) { next(error);}); 
};