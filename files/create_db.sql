create database hello owner reyhan template template0;
create table person(
	id char(10) primary key,
	name varchar(64) not null
);
create table profile(
	id char(10) primary key,
	i1 int not null,
	i2 int not null,
	i3 int not null,
	i4 int not null,
	i5 int not null,
	i6 int not null,
	i7 int not null,
	i8 int not null,
	i9 int not null,
	i10 int not null,
	i11 int not null,
	i12 int not null,
	i13 int not null,
	i14 int not null,
	i15 int not null,
	constraint fk_to_person foreign key (id) references person(id) on delete cascade on update cascade
);
create table friendship(
	person_id char(10) not null,
	friend_id char(10) not null,
	constraint fk_to_person foreign key (person_id) references person(id) on delete cascade on update cascade,
	constraint fk_to_person_for_friend foreign key (friend_id) references person(id) on delete cascade on update cascade
);
