//
//  ViewController.m
//  Spoticka
//
//  Created by Sean Hess on 4/12/14.
//  Copyright (c) 2014 Orbital Labs. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    NSLog(@"Loaadsdfdf");
    NSURL * url = [NSURL URLWithString:@"http://spoticka.com"];
    NSURLRequest * request = [NSURLRequest requestWithURL:url];
    [self.webView loadRequest:request];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
