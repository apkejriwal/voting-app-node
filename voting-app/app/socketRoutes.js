// The routes listed below handle the voting aspect of the application 
// voting is a post call which generates from rushee_list.ejs 
// each button is associated with a rushee email and value 


var User            = require('../app/models/user');

module.exports = function(app,io) {

// make post call 
   app.post('/vote', function(req,res){

        User.findOne({'local.email' : req.body.rushee_email}, function(err, rushee) {
            if (err) throw error; 


            var brother_email = req.user.local.email;
            var vote_value  = req.body.vote_value;

            // create vote object from req.body and brother_email (req.user)
            var vote_struct = {brother_email, vote_value};

            var rushee_votes = rushee.votes;

            // bool value to denote whether an 
            var update_bool = false; 

            //check and see if a brother has already voted
            for (var i = 0; i < rushee_votes.length; i++) {

                // if a brother has voted
                if (rushee_votes[i].brother_email == brother_email) {
                    rushee.votes[i] = vote_struct;
                    update_bool = true;

                    // update and save the value 
                    rushee.save(function(err) {
                        if (err) throw err;
                        console.log('Rushee successfully updated! update');
                        res.redirect('rushee_list');

                
                    // socket code that would emit to all clients to refresh their page
                    // as a result, every client would be updated with the current amount of votes 

                    // io.sockets.emit('login','test');

                    // io.socket.on('redirect', function(destination) {
                    //     console.log("hit redirect");
                    //     window.location.href = destination;
                    // });

                    });
                }
            }

            //if not, push it and add it to the rushee's vote attribute
            if (!update_bool) {
                rushee.votes.push(vote_struct); 

                rushee.save(function(err) {
                    if (err) throw err;
                    console.log('Rushee successfully updated! insert' );
                    res.redirect('rushee_list');


                    // socket code that would emit to all clients to refresh their page
                    // as a result, every client would be updated with the current amount of votes 

                    // socket.emit('login','test');

                    // socket.on('redirect', function(destination) {
                    //     console.log("hit redirect");
                    //     window.location.href = destination;
                    // });

                });
            }
            });

    });
}