import {Component, OnInit} from '@angular/core';
import {environment} from "../../../../environments/environment.development";
import {FavouriteService} from "../../../shared/services/favorite.service";
import {FavouriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {query} from "@angular/animations";

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent implements OnInit {

  products: FavouriteType[] = [];
  serverStaticPath = environment.serverStaticPath;
  cart: CartType | null = null;
  quantity = 1;

  constructor(private favouriteService: FavouriteService,
              private _snackBar: MatSnackBar,
              private cartService: CartService) {
  }

  ngOnInit() {
    this.favouriteService.getFavourites()
      .subscribe((data: FavouriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.products = data as FavouriteType[];

        this.cartService.getCart()
          .subscribe(
            {
              next: (data: CartType | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  throw new Error(error);
                }

                this.cart = data as CartType;
                console.log(this.cart);
                if (this.cart) {
                  this.products = this.products.map(product => {
                    const productInCart = this.cart?.items.find((item) => item.product.id === product.id);
                    if (productInCart) {
                      product.isInCart = true;
                      product.quantity = productInCart.quantity;
                    } else {
                      product.isInCart = false;
                    }
                    return product;
                  });
                }

              },
              error: (errorResponse: HttpErrorResponse) => {
                if (errorResponse.error && errorResponse.error.message) {
                  this._snackBar.open(errorResponse.error.message);
                } else {
                  this._snackBar.open('Ошибка получения корзины');
                }
              }
            });
      });
  }

  removeFromFavourites(id: string) {
    this.favouriteService.removeFavorites(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          // ...
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      });
  }

}
