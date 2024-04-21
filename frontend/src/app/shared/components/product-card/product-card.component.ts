import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment.development";
import {CartService} from "../../services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavouriteType} from "../../../../types/favorite.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FavouriteService} from "../../services/favorite.service";
import {Router} from "@angular/router";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductType;
  @Input() isLight = false;
  @Input() countInCart: number | undefined = 0;
  serverStaticPath = environment.serverStaticPath;
  count = 1;
  isLogged = false;

  constructor(private cartService: CartService,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private favouriteService: FavouriteService) {
  }

  ngOnInit() {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }

    this.isLogged = this.authService.getIsLoggedIn();
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.countInCart = this.count;
      });
  }

  updateCount(value: number) {
    this.count = value;

    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          this.countInCart = this.count;
        });
    }
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.countInCart = 0;
        this.count = 1;
      });
  }

  updateFavorite() {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Для добавления в избранное необходимо авторизоваться');
      return;
    }
    if (this.product.isInFavorite) {
      this.favouriteService.removeFavorites(this.product.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            // ...
            throw new Error(data.message);
          }
          this.product.isInFavorite =  false;
        });
    } else {
      this.favouriteService.addFavorite(this.product.id)
        .subscribe((data: FavouriteType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.product.isInFavorite = true;
        });
    }
  }

  navigate() {
    if (this.isLight) {
       this.router.navigate(['/product/' + this.product.url]);
    }
  }
}
