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
    // VOTING SECTION =====================
    // =====================================

      app.get('/voting', isLoggedIn, function(req,res){
            res.render('voting.ejs', {
                user :req.user 
            })
        });

    // =====================================
    // ADD BROTHER SECTION =================
    // =====================================

    app.get('/add_brother', isLoggedIn, function(req,res){
            res.render('add_brother.ejs')
        });

    // =====================================
    // RUSHEE LIST SECTION =================
    // =====================================

    app.get('/rushee_list', isLoggedIn, function(req,res){
        User.byRushee("Rushee", function(err, rou) {
            if (rou) {
                var first_names = [];
                var last_names = [];
                var majors = [];
                var emails = [];
                var yes_votes = [];
                var no_votes = [];

                for (i = 0; i < rou.length; i++) { 
                    first_names.push(rou[i].personal.first_name);
                    last_names.push(rou[i].personal.last_name);
                    majors.push(rou[i].personal.major);
                    emails.push(rou[i].local.email);
                }
                res.render('rushee_list.ejs', {user: req.user, first_names_list : first_names, last_names_list : last_names, majors_list : majors, emails_list: emails })
            }
            else {
                if (err) {
                    console.log(err);
                }
            }
         })  
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

function isBrother(req,res,next) {
    if (req.isAuthenticated())
        if (req.user.role === 'Pledge');
            return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}