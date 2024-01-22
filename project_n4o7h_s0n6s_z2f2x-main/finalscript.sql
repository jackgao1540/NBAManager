
drop table CHEERSFOR cascade constraints;                                       
drop table COACHED cascade constraints;                                         
drop table COACHES cascade constraints;                                         
drop table COMPANY cascade constraints;                                         
drop table ENDORSES cascade constraints;                                        
drop table HOSTS cascade constraints;                                           
drop table MANAGERS cascade constraints;                                        
drop table PLAYSFOR cascade constraints;                                        
drop table REPORTERS cascade constraints;                                       
drop table SPONSOR cascade constraints;                                         
drop table STADIUM cascade constraints;                                                                    
drop table STARPLAYER cascade constraints;                                      
drop table SUPPORTS cascade constraints;                                        
drop table TEAMS cascade constraints;     

CREATE TABLE Teams (
    Name VARCHAR(50),
    WinLossRatio CHAR(5),
    Location VARCHAR(50) NOT NULL,
    Championships INT,
    CourtID INT UNIQUE,
    primary key (Name)
);

create table Managers (
ManagerID int,
LastName varchar(50),
FirstName varchar(50),
TeamName varchar(50) UNIQUE not null,
primary key (ManagerID), 
foreign key (TeamName) references Teams(Name)
);

CREATE TABLE CheersFor (
CheerleaderID INT,
Name VARCHAR(50),
TeamName VARCHAR(50) NOT NULL,
PRIMARY KEY (CheerleaderID, TeamName),
FOREIGN KEY (TeamName) REFERENCES Teams(Name)
);

CREATE TABLE Supports (
FanID INT,
Name VARCHAR(50),
TeamName VARCHAR(50),
PRIMARY KEY (FanID, TeamName),
FOREIGN KEY (TeamName) REFERENCES Teams(Name)
);

CREATE TABLE PlaysFor (
FirstName VARCHAR(50),
LastName VARCHAR(50),
NickName VARCHAR(50),
TeamName VARCHAR(50),
Salary DOUBLE PRECISION,
PRIMARY KEY (FirstName, LastName, TeamName),
FOREIGN KEY (TeamName) REFERENCES Teams(Name),
UNIQUE (FirstName, LastName),
UNIQUE (NickName)
);

CREATE TABLE StarPlayer (
FirstName VARCHAR(50),
LastName VARCHAR(50),
TeamName VARCHAR(50),
PPG DOUBLE PRECISION,
MPG DOUBLE PRECISION,
PRIMARY KEY (FirstName, LastName, TeamName),
FOREIGN KEY (FirstName, LastName) REFERENCES PlaysFor(FirstName,
LastName) ON DELETE CASCADE,
FOREIGN KEY (TeamName) REFERENCES Teams(Name)
);

CREATE TABLE Stadium (
CourtID INT,
Location VARCHAR(50) UNIQUE,
Capacity INT,
primary key (CourtID)
);

CREATE TABLE Company (
CompanyName VARCHAR(50),
Address VARCHAR(50),
CourtID INT,
primary key (CompanyName),
FOREIGN KEY (CourtID) REFERENCES Stadium(CourtID)
);

CREATE TABLE Endorses (
CompanyName VARCHAR (50),
FirstName VARCHAR (50),
LastName VARCHAR(50),
TeamName VARCHAR(50),
YearlyDeal DOUBLE PRECISION,
PRIMARY KEY (CompanyName, FirstName, LastName, TeamName),
FOREIGN KEY (CompanyName) REFERENCES Company(CompanyName),
FOREIGN KEY (FirstName, LastName) REFERENCES PlaysFor(FirstName,
LastName) ON DELETE CASCADE,
FOREIGN KEY (TeamName) REFERENCES Teams(Name)
);

CREATE TABLE Sponsor (
CompanyName VARCHAR(50),
CourtID INT,
YearlyDeal INT,
PRIMARY KEY (CompanyName, CourtID),
FOREIGN KEY (CompanyName) REFERENCES Company(CompanyName),
FOREIGN KEY (CourtID) REFERENCES Stadium(CourtID)
);

CREATE TABLE Coaches (
CoachID INT,
FirstName VARCHAR(50),
LastName VARCHAR(50),
Salary DOUBLE PRECISION,
TeamName VARCHAR(50) UNIQUE NOT NULL,
primary key (CoachID),
FOREIGN KEY (TeamName) REFERENCES Teams(Name)
);

CREATE TABLE Coached (
CoachID INT,
TeamName VARCHAR(50),
Title VARCHAR(50),
PRIMARY KEY (CoachID, TeamName),
FOREIGN KEY (CoachID) REFERENCES Coaches(CoachID),
FOREIGN KEY (TeamName) REFERENCES Teams(Name)
);

CREATE TABLE Reporters (
ReporterID INT,
Name VARCHAR(50),
ReportedChannelName VARCHAR(50),
TeamName VARCHAR(50),
primary key (ReporterID),
FOREIGN KEY (TeamName) REFERENCES Teams(Name)
);

CREATE TABLE Hosts (
GameID INT,
GameScore VARCHAR(50),
AudienceNumber INT,
TeamName VARCHAR(50),
CourtID INT,
DatePlayed VARCHAR(10),
PRIMARY KEY (GameID),
FOREIGN KEY (TeamName) REFERENCES Teams(Name),
FOREIGN KEY (CourtID) REFERENCES Stadium(CourtID)
);


INSERT INTO Teams VALUES ('Sacramento Kings', '2:8', 'Sacramento', 3, 1);
INSERT INTO Teams VALUES ('Charlotte Hornets', '1:9', 'Charlotte', 2, 2);
INSERT INTO Teams VALUES ('Boston Celtics', '9:1', 'Boston', 5, 3);
INSERT INTO Teams VALUES ('Orlando Magic', '5:5', 'Orlando', 1, 4);
INSERT INTO Teams VALUES ('Toronto Raptors', '6:4', 'Toronto', 4, 5);

INSERT INTO Managers VALUES (1, 'Buchanan', 'Nick', 'Toronto Raptors');
INSERT INTO Managers VALUES (2, 'Smith', 'Anna', 'Orlando Magic');
INSERT INTO Managers VALUES (3, 'Johnson', 'Harold', 'Boston Celtics');
INSERT INTO Managers VALUES (4, 'Rogers', 'Mandy', 'Charlotte Hornets');
INSERT INTO Managers VALUES (5, 'Patterson', 'Louise', 'Sacramento Kings');

INSERT INTO CheersFor VALUES (1, 'Brenda', 'Sacramento Kings');
INSERT INTO CheersFor VALUES (2, 'Treesha', 'Charlotte Hornets');
INSERT INTO CheersFor VALUES (3, 'Uniqua', 'Boston Celtics');
INSERT INTO CheersFor VALUES (4, 'Joy', 'Orlando Magic');
INSERT INTO CheersFor VALUES (5, 'Skeeza', 'Toronto Raptors');

INSERT INTO Supports VALUES (1, 'FoxFan1', 'Sacramento Kings');
INSERT INTO Supports VALUES (2, 'MeloFan1', 'Charlotte Hornets');
INSERT INTO Supports VALUES (3, 'Nav', 'Boston Celtics');
INSERT INTO Supports VALUES (3, 'Nav', 'Toronto Raptors');
INSERT INTO Supports VALUES (3, 'Nav', 'Orlando Magic');
INSERT INTO Supports VALUES (3, 'Nav', 'Charlotte Hornets');
INSERT INTO Supports VALUES (3, 'Nav', 'Sacramento Kings');
INSERT INTO Supports VALUES (4, 'Fanatic4', 'Orlando Magic');
INSERT INTO Supports VALUES (5, 'Loyal5', 'Toronto Raptors');

INSERT INTO PlaysFor VALUES ('Kevin', 'Huerter', 'Wonder Boy','Sacramento Kings', 12.5);
INSERT INTO PlaysFor VALUES ('Lamelo', 'Ball', 'Melo' ,'Charlotte Hornets', 20.2);
INSERT INTO PlaysFor VALUES ('Jrue', 'Holiday', 'Jew' ,'Boston Celtics', 19.8);
INSERT INTO PlaysFor VALUES ('Jalen', 'Suggs', 'Dawg','Orlando Magic', 11.6);
INSERT INTO PlaysFor VALUES ('Dennis', 'Shroder', 'Alien' ,'Toronto Raptors', 10.8);
INSERT INTO PlaysFor VALUES ('De''Aaron', 'Fox', 'Swipa', 'Sacramento Kings', 84);
INSERT INTO PlaysFor VALUES ('Jayson', 'Tatum', 'JT', 'Boston Celtics', 28);
INSERT INTO PlaysFor VALUES ('Pascal', 'Siakam', 'SpicyP', 'Toronto Raptors', 29);
INSERT INTO PlaysFor VALUES ('Jonathan', 'Isaac', 'J.I.', 'Orlando Magic', 9.2);
INSERT INTO PlaysFor VALUES ('Harrison', 'Barnes', 'Barnes', 'Sacramento Kings', 20);
INSERT INTO PlaysFor VALUES ('Gordon', 'Hayward', 'G-Time', 'Charlotte Hornets', 28);
INSERT INTO PlaysFor VALUES ('Jaylen', 'Brown', 'JB', 'Boston Celtics', 25);
INSERT INTO PlaysFor VALUES ('Fred', 'VanVleet', 'SteadyFreddy', 'Toronto Raptors', 2.1);
INSERT INTO PlaysFor VALUES ('Markelle', 'Fultz', 'Fultz', 'Orlando Magic', 1.2);
INSERT INTO PlaysFor VALUES ('Buddy', 'Hield', 'Buddy', 'Sacramento Kings', 2);
INSERT INTO PlaysFor VALUES ('Terry', 'Rozier', 'ScaryTerry', 'Charlotte Hornets', 19);
INSERT INTO PlaysFor VALUES ('Marcus', 'Smart', 'Smart', 'Boston Celtics', 14);
INSERT INTO PlaysFor VALUES ('OG', 'Anunoby', 'OG', 'Toronto Raptors', 16);
INSERT INTO PlaysFor VALUES ('Nikola', 'Vucevic', 'Vooch', 'Orlando Magic', 26);
INSERT INTO PlaysFor VALUES ('Marvin', 'Bagley III', 'MB3', 'Sacramento Kings', 8.6);
INSERT INTO PlaysFor VALUES ('Gordon', 'Rhay', 'G-Rhay', 'Charlotte Hornets', 1.2);
INSERT INTO PlaysFor VALUES ('Robert', 'Williams', 'TimeLord', 'Boston Celtics', 2.1);
INSERT INTO PlaysFor VALUES ('Chris', 'Boucher', 'SlimDuck', 'Toronto Raptors', 7);
INSERT INTO PlaysFor VALUES ('Chuma', 'Okeke', 'Chuma', 'Orlando Magic', 4.1);
 

INSERT INTO StarPlayer VALUES ('Kevin', 'Huerter', 'Sacramento Kings', 22.4, 25);
INSERT INTO StarPlayer VALUES ('Lamelo', 'Ball', 'Charlotte Hornets', 27.3, 30.3);
INSERT INTO StarPlayer VALUES ('Jrue', 'Holiday', 'Boston Celtics', 25.4, 29.4);
INSERT INTO StarPlayer VALUES ('Jalen', 'Suggs', 'Orlando Magic', 20.3, 17);
INSERT INTO StarPlayer VALUES ('Dennis', 'Shroder', 'Toronto Raptors', 29.3, 24.5);
INSERT INTO StarPlayer VALUES ('Jayson', 'Tatum','Boston Celtics', 28, 36);
INSERT INTO StarPlayer VALUES ('Pascal', 'Siakam','Toronto Raptors', 22, 31);
INSERT INTO StarPlayer VALUES ('Gordon', 'Hayward','Charlotte Hornets', 20.4, 30.1);
INSERT INTO StarPlayer VALUES ('Jaylen', 'Brown','Boston Celtics', 30, 25);
INSERT INTO StarPlayer VALUES ('Fred', 'VanVleet','Toronto Raptors', 23.1, 29.4);
INSERT INTO StarPlayer VALUES ('Buddy', 'Hield','Sacramento Kings', 25.3, 26.3);
INSERT INTO StarPlayer VALUES ('Terry', 'Rozier','Charlotte Hornets', 21, 20.4);
INSERT INTO StarPlayer VALUES ('Marcus', 'Smart','Boston Celtics', 23.5, 31);
INSERT INTO StarPlayer VALUES ('OG', 'Anunoby','Toronto Raptors', 21.3, 36.6);
INSERT INTO StarPlayer VALUES ('Nikola', 'Vucevic','Orlando Magic', 20, 18);

INSERT INTO Stadium VALUES (1, 'Sacramento', 18218);
INSERT INTO Stadium VALUES (2, 'Charlotte', 19596);
INSERT INTO Stadium VALUES (3, 'Boston', 19600);
INSERT INTO Stadium VALUES (4, 'Orlando', 17923);
INSERT INTO Stadium VALUES (5, 'Toronto', 19812);

INSERT INTO Company VALUES ('Nike', '15 Walnut street', 1);
INSERT INTO Company VALUES ('Under Armour', '69 Butox street', 2);
INSERT INTO Company VALUES ('Jordan', '24 Fern street', 3);
INSERT INTO Company VALUES ('Adidas', '43 Hastings Lane', 4);
INSERT INTO Company VALUES ('Arc’Teryx', '13 Dusk Street', 5);

INSERT INTO Endorses VALUES ('Nike', 'Dennis', 'Shroder', 'Toronto Raptors', 23);
INSERT INTO Endorses VALUES ('Under Armour', 'Jalen', 'Suggs', 'Orlando Magic', 17);
INSERT INTO Endorses VALUES ('Jordan', 'Jrue', 'Holiday', 'Boston Celtics', 3);
INSERT INTO Endorses VALUES ('Nike', 'Lamelo', 'Ball', 'Charlotte Hornets', 4);
INSERT INTO Endorses VALUES ('Adidas', 'Kevin', 'Huerter', 'Sacramento Kings', 5);

INSERT INTO Sponsor VALUES ('Nike', 1, 10);
INSERT INTO Sponsor VALUES ('Under Armour', 2, 15);
INSERT INTO Sponsor VALUES ('Jordan', 3, 80);
INSERT INTO Sponsor VALUES ('Adidas', 4, 75);
INSERT INTO Sponsor VALUES ('Arc’Teryx', 5, 60);

INSERT INTO Coaches VALUES (1, 'Gregg', 'Popovich', 60.1, 'Sacramento Kings');
INSERT INTO Coaches VALUES (2, 'Steve', 'Kerr', 50.44, 'Charlotte Hornets');
INSERT INTO Coaches VALUES (3, 'Erik', 'Spoelstra', 30.3, 'Boston Celtics');
INSERT INTO Coaches VALUES (4, 'Rick', 'Carlisle', 40.3, 'Orlando Magic');
INSERT INTO Coaches VALUES (5, 'Tom', 'Thibodeau', 37.56, 'Toronto Raptors');

INSERT INTO Coached VALUES (1, 'Sacramento Kings', 3);
INSERT INTO Coached VALUES (2, 'Charlotte Hornets', 2);
INSERT INTO Coached VALUES (3, 'Boston Celtics', 3);
INSERT INTO Coached VALUES (4, 'Orlando Magic', 4);
INSERT INTO Coached VALUES (5, 'Toronto Raptors', 1);

INSERT INTO Reporters VALUES (1, 'Doris Burke', 'ESPN', 'Sacramento Kings');
INSERT INTO Reporters VALUES (2, 'Shaquille O''Neal', 'TNT', 'Charlotte Hornets');
INSERT INTO Reporters VALUES (3, 'Charles Barkley', 'ESPN', 'Boston Celtics');
INSERT INTO Reporters VALUES (4, 'Ernie Johnson', 'TNT', 'Orlando Magic');
INSERT INTO Reporters VALUES (5, 'Kenny Smith', 'TNT', 'Toronto Raptors');

INSERT INTO Hosts VALUES (1,'102:99', 18000, 'Sacramento Kings', 2, '01-08-2023');
INSERT INTO Hosts VALUES (2,'121:112', 19500, 'Charlotte Hornets', 1, '02-10-2023');
INSERT INTO Hosts VALUES (3,'115:103', 19200, 'Boston Celtics', 5, '03-10-202');
INSERT INTO Hosts VALUES (4,'89:88', 17000, 'Orlando Magic', 3, '04-02-2023');
INSERT INTO Hosts VALUES (5,'104:101', 19700, 'Toronto Raptors', 2, '02-15-2023');
INSERT INTO Hosts VALUES (6,'109:104', 125000, 'Sacramento Kings', 3, '01-15-2023');
INSERT INTO Hosts VALUES (7,'118:115', 120000, 'Charlotte Hornets', 3, '02-02-2023');
INSERT INTO Hosts VALUES (8,'110:108', 135000, 'Boston Celtics', 4, '03-10-2023');
INSERT INTO Hosts VALUES (9,'92:90', 140000, 'Orlando Magic', 1, '04-07-2023');
INSERT INTO Hosts VALUES (10,'112:107', 130000, 'Toronto Raptors', 2, '06-28-2023');
INSERT INTO Hosts VALUES (11,'99:95', 140000, 'Sacramento Kings', 4, '02-02-2023');
INSERT INTO Hosts VALUES (12,'105:102', 130000, 'Charlotte Hornets', 1, '03-10-2023');
INSERT INTO Hosts VALUES (13,'112:110', 145000, 'Boston Celtics', 2, '04-15-2023');
INSERT INTO Hosts VALUES (14,'94:91', 120000, 'Orlando Magic', 5, '05-01-2023');
INSERT INTO Hosts VALUES (15,'120:115', 135000, 'Toronto Raptors', 2, '07-10-2023');
INSERT INTO Hosts VALUES (16,'108:104', 125000, 'Sacramento Kings', 5, '08-12-2023');
INSERT INTO Hosts VALUES (17,'117:114', 130000, 'Charlotte Hornets', 1, '09-18-2023');
INSERT INTO Hosts VALUES (18,'104:102', 145000, 'Boston Celtics', 4, '10-25-2023');
INSERT INTO Hosts VALUES (19,'97:92', 140000, 'Orlando Magic', 1, '11-05-2023');
INSERT INTO Hosts VALUES (20,'114:110', 130000, 'Toronto Raptors', 3, '12-20-2023');
INSERT INTO Hosts VALUES (21,'101:98', 125000, 'Sacramento Kings', 2, '01-02-2023');
INSERT INTO Hosts VALUES (22,'112:108', 130000, 'Charlotte Hornets', 4, '02-15-2023');
INSERT INTO Hosts VALUES (23,'120:118', 140000, 'Boston Celtics', 1, '03-22-2023');
INSERT INTO Hosts VALUES (24,'99:94', 120000, 'Orlando Magic', 5, '04-10-2023');
INSERT INTO Hosts VALUES (25,'105:103', 135000, 'Toronto Raptors', 3, '06-30-2023');


COMMIT;
