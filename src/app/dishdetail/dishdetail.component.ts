import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

import { Dish } from '../shared/dish'

import { DishService } from '../services/dish.service';

import { switchMap } from 'rxjs/operators';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @ViewChild('cform') commentFormDirective;

  commentForm: FormGroup;
  comment: Comment;
  formErrors = {
    'author': '',
    'comment':''
  };

  dish : Dish;
  dishIds: string[];
  prev: string;
  next: string;

  validationMessages = {
    'author': {
      'required': 'Author Name is required',
      'minlength':  'Author name must be atleast 2 characters',
      'maxlength':  'Author name cannot be more than 25 characters'
    },
    'comment': {
      'required': 'Comments are required',
      'minlength':  'Comments must be atleast 2 characters long'
    }
  };
  
  constructor(private dishservice: DishService, private route: ActivatedRoute, private location: Location, private cf: FormBuilder)
  {
    this.createForm();
  }

  ngOnInit() 
  {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  createForm()
  {
    this.commentForm = this.cf.group({
      author: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      comment: ['',[Validators.required, Validators.minLength(2)]],
      rating: 5,
      date: ''
    });

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any)
  {
    if (!this.commentForm) { return;}
    const form=this.commentForm;
    for (const field in this.formErrors)
    {
      if(this.formErrors.hasOwnProperty(field))
      {
        this.formErrors[field]='';
        const control = form.get(field);
        if (control && control.dirty && !control.valid)
        {
          const messages = this.validationMessages[field];
          for (const key in control.errors)
          {
            if (control.errors.hasOwnProperty(key))
            {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit()
  {
    var d= new Date();
    this.comment = this.commentForm.value;
    console.log(this.comment.rating)
    this.comment.date = d.toDateString();
    console.log(this.comment);
    this.dish.comments.push(this.comment)
    console.log("done")
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: '',
      date:''
    });
    this.commentFormDirective.resetForm();
  }

  goBack(): void 
  {
    this.location.back();
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

}
