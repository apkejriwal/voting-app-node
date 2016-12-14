// importing User Model 

var User            = require('../app/models/user');

// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

  
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // ADD BROTHER SECTION =================
    // =====================================

    // view generated for a get to create a new brother
    // only accessible by logged in brothers, and not rushees 

    app.get('/add_brother', isLoggedIn, function(req,res){
            res.render('add_brother.ejs');
    });

    // =====================================
    // RUSHEE LIST SECTION =================
    // =====================================

    // using Mongoose model to query the user model
    // returns a list of all rushees 
    // callback returns values of rushees. values are parsed and displayed in get of rushee_list
    app.get('/rushee_list', isLoggedIn, function(req,res){

        User.find({role: "Rushee"}, function (err, users){
            if (err) throw err;
            
            if (users) {
                var first_names = [];
                var last_names = [];
                var majors = [];
                var emails = [];
                var yes_votes = [];
                var no_votes = [];

                for (i = 0; i < users.length; i++) { 
                    first_names.push(users[i].personal.first_name);
                    last_names.push(users[i].personal.last_name);
                    majors.push(users[i].personal.major);
                    emails.push(users[i].local.email);

                    var yes = 0; 
                    var no = 0; 

                    for (j = 0; j < users[i].votes.length; j++ ) {
                        if (users[i].votes[j].vote_value == "Yes") {
                            ++yes;
                        }
                        else {
                            ++no;
                        }
                    }
                    yes_votes.push(yes);
                    no_votes.push(no);
                }

                // sends params to rushee_list ejs file to generate table
                res.render('rushee_list.ejs', {user: req.user, first_names_list : first_names, 
                    last_names_list : last_names, majors_list : majors, emails_list: emails,
                    yes_votes_list : yes_votes, no_votes_list : no_votes});
            }
        });
        });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
