-- usage: login to SQLPLUS, then type '@startup.sql'

SPOOL drop_tables.sql;
select 'drop table '||table_name||' cascade constraints;' from user_tables;     
SPOOL OFF;
@drop_tables.sql;
COMMIT;

-- make sure all are deleted
select table_name from user_tables;

-- defining a constant VARCHAR length
DEFINE VARCHAR_SIZE = '50';

-- creating the tables related to the design schema as shown in Milestone 2 -- or updated
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

-- see table names
select table_name from user_tables;

-- populate tables
@populateTables.sql;

-- Commit changes
COMMIT;
