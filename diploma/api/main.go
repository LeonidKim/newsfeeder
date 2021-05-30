package main

import (
	gin "github.com/LeonidKim/newsfeeder/diploma/api/httpd/routes"
)

func main() {
	var s gin.Routes
	s.StartGin()

}

/*
	Karena variable s memiliki tipe gin.Server milik server.go
	maka s dapat menjalan kan fungsi StartGin
*/
