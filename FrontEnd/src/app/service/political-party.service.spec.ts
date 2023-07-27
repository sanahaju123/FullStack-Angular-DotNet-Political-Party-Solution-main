import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PoliticalPartyComponent } from '../component/political-party.component';
import { PoliticalPartyService } from './political-party.service';
import { PoliticalParty } from '../model/political-party.model';

describe('PoliticalPartyService', () => {
    let component: PoliticalPartyComponent;
    let fixture: ComponentFixture<PoliticalPartyComponent>;
    let mockPartyService: Partial<PoliticalPartyService>;

    beforeEach(async () => {
        mockPartyService = {
            getAllPoliticalParties: jest.fn(() => of([
                { id: 1, name: 'Party 1', founder: 'Founder 1', isDeleted: false },
                { id: 2, name: 'Party 2', founder: 'Founder 2', isDeleted: false },
            ])),
            createPoliticalParty: jest.fn(() => of({ id: 3, name: 'New Party', founder: 'New Founder', isDeleted: false })),
            updatePoliticalParty: jest.fn(() => of({ id: 1, name: 'Updated Party', founder: 'Updated Founder', isDeleted: false })),
            deletePoliticalParty: jest.fn(() => of()),
            searchPoliticalPartyByName: jest.fn(() => of([])),
            searchPoliticalPartyByFounder: jest.fn(() => of([])),
        };

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [PoliticalPartyComponent],
            providers: [
                FormBuilder,
                { provide: PoliticalPartyService, useValue: mockPartyService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PoliticalPartyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe("business", () => {
        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should fetch all political parties on initialization', () => {
            component.ngOnInit();
            expect(component.parties.length).toBe(2);
            expect(mockPartyService.getAllPoliticalParties).toHaveBeenCalled();
        });

        it('should create a new political party', () => {
            component.partyForm.get('name')?.setValue('Test Party');
            component.partyForm.get('founder')?.setValue('Test Founder');

            component.createParty();

            fixture.detectChanges();

            expect(component.parties.length).toBe(3);

            const createdParty = component.parties[2];
            expect(createdParty.name).toBe('New Party');
            expect(createdParty.founder).toBe('New Founder');
        });

        it('should delete a political party', () => {
            const partyToDelete: PoliticalParty = {
                id: 1,
                name: 'Test Party',
                founder: 'Test Founder',
                isDeleted: false,
            };

            component.parties = [partyToDelete];
            fixture.detectChanges();

            component.deleteParty(partyToDelete.id);
            fixture.detectChanges();

            expect(component.parties.length).toBe(1);
        });

        it('should search political parties by name', () => {
            const searchName = 'Party 1';
            component.searchByName({ target: { value: searchName } });
            expect(mockPartyService.searchPoliticalPartyByName).toHaveBeenCalledWith(searchName);
            expect(component.parties.length).toBe(0);
        });

        it('should search political parties by founder', () => {
            const searchFounder = 'Founder 1';
            component.searchByFounder({ target: { value: searchFounder } });
            expect(mockPartyService.searchPoliticalPartyByFounder).toHaveBeenCalledWith(searchFounder);
            expect(component.parties.length).toBe(0);
        });

        it('should edit a political party', () => {
            const partyToEdit: PoliticalParty = {
                name: 'Party 1', founder: 'Founder 1', isDeleted: false,
                id: 0
            };
            component.editParty(partyToEdit);
            expect(component.partyForm.value).toEqual({ name: 'Party 1', founder: 'Founder 1', isDeleted: false });
        });
    });
});
