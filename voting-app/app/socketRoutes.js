var User            = require('../app/models/user');

module.exports = function(app,io) {
   app.post('/vote', function(req,res){

        User.findOne({'local.email' : req.body.rushee_email}, function(err, rushee) {
            if (err) throw error; 

            var brother_email = req.user.local.email;
            var vote_value  = req.body.vote_value;

            var vote_struct = {brother_email, vote_value};

            var rushee_votes = rushee.votes;
            var update_bool = false; 

            //check and see if a brother has already voted
            for (var i = 0; i < rushee_votes.length; i++) {
                if (rushee_votes[i].brother_email == brother_email) {
                    rushee.votes[i] = vote_struct;
                    update_bool = true;

                    rushee.save(function(err) {
                        if (err) throw err;
                        console.log('Rushee successfully updated! update');
                        res.redirect('rushee_list');
                    });
                }
            }

            //if not, add it to the rushee's votes 
            if (!update_bool) {
                rushee.votes.push(vote_struct); 

                rushee.save(function(err) {
                    if (err) throw err;
                    console.log('Rushee successfully updated! insert' );
                    res.redirect('rushee_list');
                });

            }

            });

    });
}