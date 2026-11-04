import { Component, ChangeDetectionStrategy, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Garagix Auto Care';
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        const tree = this.router.parseUrl(event.urlAfterRedirects || event.url);
        if (tree.fragment) {
          setTimeout(() => {
            this.viewportScroller.scrollToAnchor(tree.fragment!);
          }, 0);
        } else {
          this.scrollToTop();
          requestAnimationFrame(() => this.scrollToTop());
          setTimeout(() => this.scrollToTop(), 60);
        }
      });
  }

  private scrollToTop(): void {
    if (typeof window !== 'undefined') {
      this.viewportScroller.scrollToPosition([0, 0]);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
      const scrollables = document.querySelectorAll('main');
      scrollables.forEach((el) => {
        if (el.scrollTop > 0) {
          el.scrollTop = 0;
        }
      });
    }
  }
}
